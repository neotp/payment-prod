import asyncio
from decimal import Decimal
from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends, Request, logger
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pyrfc import Connection, ABAPApplicationError, ABAPRuntimeError, LogonError, CommunicationError
from pydantic import BaseModel, Field
from typing import Dict, List
import mysql.connector
import datetime
import random
import logging
import hashlib
from datetime import date, datetime
import requests
from zeep import Client
from zeep.transports import Transport
from requests.auth import HTTPBasicAuth
from apscheduler.schedulers.background import BackgroundScheduler
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import xml.etree.ElementTree as ET
import re
import pytz
from apscheduler.schedulers.asyncio import AsyncIOScheduler

app = FastAPI()

logger = logging.getLogger(__name__)

logger.setLevel(logging.INFO)

if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    
scheduler = AsyncIOScheduler()

    
    
# Conf for SOAP, SAP
WSDL_URL = "http://172.21.130.233/Application/PaymentMGT.nsf/PaymentWS?WSDL"
USERNAME = "Pimcore Commerce"
PASSWORD = "password@1"
METHOD = "FNCREATEPAYMENTS" 

SAP_CONFIG = {
    "ashost": "172.21.130.208"
    , "sysnr": "00"
    , "client": "110"
    , "user": "notes"
    , "passwd": "february_02"
}

origins = [
    "http://localhost:4200",
    "http://webapp.sisthai:4200",
    "http://localhost:7070",
    "http://webapp.sisthai:7070",
    "http://172.31.144.1:7070",
    "http://172.31.20.11:7070",
    "https://webapp.sisthai.com",
    "https://172.17.17.127"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conf for MySQL
MYSQL_CONFIG = {
    "host": "172.31.50.11"
    , "user": "root"
    , "password": "P@ssw0rdSiS"
    , "database": "payment_db"
}

# ---------------------- Model ----------------------
class LoginData(BaseModel):
    username: str
    password: str
    
class RegisterData(BaseModel):
    fstname: str
    lstname: str
    customercode: str
    customername: str
    username: str
    password: str
    email: str
    position: str
    
class CreatUser(BaseModel):
    username: str
    password: str
    fstname: str
    lstname: str
    email: str
    pos: str
    role: str

    
class UpdateDateUser(BaseModel):
    usrname: str
    usrrole: str
    usrstat: str
    
class DeleteUser(BaseModel):
    usrid: int
    usrname: str
    
 
class FindCuscode(BaseModel):
    username: str
    
class GetInv(BaseModel):
    usrcuscode: str
    
class FindSumamt(BaseModel):
    cuscode: str
    
class FindFeeRate(BaseModel):
    bank: str
    card: str
    
class Payment(BaseModel):
    username: str
    cuscode: str
    sumamt: str
    fee: str
    totalAmt: str
    bank: str
    card: str
    
    
class UpdateFlag(BaseModel):
    selected: bool
    cuscode: str
    docno: str
    
class UpdatePaidAmt(BaseModel):
    cuscode: str
    docno: str
    paidamt: str
    
class UpdateAllFlag(BaseModel):
    cuscode: str
    flag: str
    
class DataPending(BaseModel):
    page_start: int
    page_limit: int
    
class LoadDate(BaseModel):
    usrcuscode: str
    page_start: int
    page_limit: int
    
    
class NotesData(BaseModel):
    company_code: str
    customer_code: str
    payment_type: str
    billing_no: str
    payment_doc: str
    assignment: str
    billing_date: str
    billing_due_date: str
    amount: float
    amount_total: float
    bank_status: str
    bank_approve_ref: str
    payment_method: str
    payment_no: str
    source: str
    approve_date: str
    approve_time: str
    reason_code: str
    
class ResponseStatus(BaseModel):
    code: int
    message: str
    
class NotesResponse(BaseModel):
    status: ResponseStatus
    
class CallBackKTC(BaseModel):
    paymentNo: str
    
class CreateSo(BaseModel):
    cuscode: str
    docType: str
    docNo: str
    docAmt: str
    usage: str
    note: str
    
class SendBank(BaseModel):
    merchantId: str
    amount: float
    orderRef: str
    currCode: str
    successUrl: str
    failUrl: str
    cancelUrl: str
    payType: str
    lang: str
    TxType: str
    Term: str
    promotionType: str
    supplierId: str
    productId: str
    serialNo: str
    model: str
    itemTotal: str
    redeemPoint: str
    paymentSkip: str
    memberPay_service: str
    memberPay_memberId: str
    secureHash: str
    
class PaymentRequest(BaseModel):
    PayRef: str
    successcode: str
    Ref: str
    
class QueryPaymentStatus(BaseModel):
    merchantId: str
    loginId: float
    password: str
    actionType: str
    orderRef: str
    payRef: str
    
class SearchPaymenthdr(BaseModel):
     cuscode : str
     payNo : str
     bank : str
     card : str
     creusr : str
     credateFrom: str
     credateTo: str
     status : str
     invNo : str
     page_start: int
     page_limit: int
     
class SearchPaymentdtl(BaseModel):
     hdrid : int
     page_start: int
     page_limit: int
    
# ---------------------- Model ----------------------
    
# Dependency: SAP Connection
def get_sap_connection():
    try:
        return Connection(**SAP_CONFIG)
    except CommunicationError:
        raise HTTPException(status_code=500, detail="Could not connect to SAP server.")
    except LogonError:
        raise HTTPException(status_code=401, detail="Could not log in to SAP.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected SAP error: {e}")

# Dependency: MySQL Connection 
def get_mysql_connection():
    try:
        return mysql.connector.connect(**MYSQL_CONFIG)
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"MySQL connection error: {err}")


# Dependency: SOAP Connection 
def call_soap_api(wsdl: str, method: str, data: dict):
    try:
        session = requests.Session()
        session.auth = HTTPBasicAuth(USERNAME, PASSWORD)
        client = Client(wsdl, transport=Transport(session=session))
        response = client.service.__getattr__(method)(**data)
        return response
    except Exception as e:
        raise Exception(f"Error making SOAP request: {e}")

@app.get("/testquery")
def testquery(conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        cursor.callproc("GetUsrpssData")
        
        cursor.execute("SELECT @result;") 
        result = cursor.fetchall()
        return JSONResponse(content={"status": "success", "data": result})
    finally:
        cursor.close()
        conn.close()
        
        
# -------------------------- login function begin --------------------------

@app.post("/login")
def login(data: LoginData, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        out_param = cursor.callproc("pkglogin_login", [
            data.username
            , data.password
            , None
            ])
        role = out_param[2]
        
        if role:
            logger.info("login : success, role: %s", role)
            return JSONResponse(content={"status": "success", "role": role})
        else:
            return JSONResponse(content={"status": "fail", "role": "notfound"})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        cursor.close()
        conn.close()

@app.post("/register")
def register(data: RegisterData, background_tasks: BackgroundTasks, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        out_param = cursor.callproc("pkgregis_regisuser", [
            data.username
            , data.password
            , data.fstname
            , data.lstname
            , data.customercode
            , data.customername
            , data.email
            , data.position
            , None
            ])

        count = out_param[8]
        
        logger.info("Registration attempt for user data '%s completed with result after: %s", data, count)
        if count == 1:
            background_tasks.add_task(
                send_registration_email
                , data.username
                , data.fstname
                , data.lstname
                , data.customercode
                , data.customername
                )
            return JSONResponse(content={"status": "success", "regis": "success"})
        elif count == 0:
            return JSONResponse(content={"status": "dup", "regis": "dup"})
        else :
            return JSONResponse(content={"status": "fail", "regis": "fail"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        cursor.close()
        conn.close()
        
def send_registration_email(username: str, fname: str, lname: str, cuscode: str, cusname: str):
    sender_email = "Chaitanachote@sisthai.com"
    sender_password = "New@191243"
    subject = "Registering in payment app!"
    email= "Chaitanachote@sisthai.com"
    cc_list = ["pornchai@sisthai.com"]
    current_datetime = datetime.now().strftime("%H:%M:%S %d/%m/%Y")
    
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = email
    message["Cc"] = ", ".join(cc_list)
    message["Subject"] = subject
    body = f"""
        <html>
            <body>
                <p><strong>User Registration</strong></p>
                <table border="1" cellspacing="0" cellpadding="5">
                    <tr>
                        <th style="background-color:#f2f2f2; text-align:left;">Username</th>
                        <th style="background-color:#f2f2f2; text-align:left;">Name</th>
                        <th style="background-color:#f2f2f2; text-align:left;">Customer Code</th>
                        <th style="background-color:#f2f2f2; text-align:left;">Customer Name</th>
                        <th style="background-color:#f2f2f2; text-align:left;">Date Time</th>
                    </tr>
                    <tr>
                        <td>{username}</td>
                        <td>{fname} {lname}</td>
                        <td>{cuscode}</td>
                        <td>{cusname}</td>
                        <td>{current_datetime}</td>
                    </tr>
                </table>
                <br>
                <br>
                <br>
                <p>Chaitanachote Wongtanaruj</p>
                <p>Information System Officer</p>
                <br>
                <p>SiS Distribution (Thailand) Public Co., Ltd.</p>
                <p>Mobile : 091-812-9900</p>
                <p>Email : chaitanachote@sisthai.com</p>
               
            </body>
        </html>
    """
    message.attach(MIMEText(body, "html"))
    try: 
        logger.info("Connecting to SMTP server...")
        server = smtplib.SMTP("172.21.130.12", 25)
        server.login(sender_email, sender_password)
        logger.info("Login successful!")
        server.sendmail(sender_email, email, message.as_string())
        
        server.quit()
        logger.info("Email sent successfully!")
    except Exception as e:
        logger.info(f"Failed to send email: {e}")

# -------------------------- login function end --------------------------
        
        
# -------------------------- mnusr function begin --------------------------

@app.post("/findDataPending")
def findDataPending(data: DataPending,conn=Depends(get_mysql_connection)):
    
    offset = (data.page_start - 1) * data.page_limit
    
    try:
        cursor2 = conn.cursor()
        
        cursor2.callproc("pkgmnusr_load_data",[
            offset
            , data.page_limit
        ])
        
        conn.commit()
        results = []
        for result in cursor2.stored_results():
            total_count = result.fetchone()[0] 
            break  
        cursor2.nextset()

        for result in cursor2.stored_results():
            results = result.fetchall()
            column_names = [desc[0] for desc in result.description]  
            formatted_results = [dict(zip(column_names, row)) for row in results]
        
        if result:
            return JSONResponse(content={"status": "success", "total": total_count, "data": formatted_results})
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials or user not active")
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
       
        if cursor2:
            try:
                cursor2.close()
            except Exception as e:
                logger.error(f"Error closing cursor2: {e}")
                
        if conn:
            conn.close()
        
@app.post("/updateDataNow")
def updateDataNow(conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        
        cursor.callproc("pkgmnusr_insert_usrpss_work")
        conn.commit()
        return JSONResponse(content={"status": "success", "message": "User updated successfully"})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        cursor.close()
        conn.close()
        
@app.post("/deleteUser")
def deleteUser(data: DeleteUser,conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        
        cursor.callproc("pkgmnusr_delete_user", [
            data.usrid
            , data.usrname
        ])
        conn.commit()
        return JSONResponse(content={"status": "success", "message": "User updated successfully"})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        cursor.close()
        conn.close()
        
@app.post("/updateDataToWork")
def updateDataToWork(data: UpdateDateUser, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        
        cursor.callproc("pkgmnusr_update_usrpss_work", [
            data.usrname
            , data.usrrole
            , data.usrstat
        ])
        conn.commit()
        return JSONResponse(content={"status": "success", "message": "User updated successfully"})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        cursor.close()
        conn.close()
        
                
@app.post("/saveData")
def saveData(conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        
        out_param = cursor.callproc("pkgmnusr_save_usrpss", [
            None
         ])
        
        conn.commit()
        
        out_param = cursor.fetchall()
        
        count = out_param[0][0] if out_param else 0
        
        if count == 1:
            return JSONResponse(content={"status": "success", "regis": "success"})
        else:
            return JSONResponse(content={"status": "success", "regis": "fail"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        cursor.close()
        conn.close()
        
@app.post("/createUser")
def createUser(data: CreatUser, background_tasks: BackgroundTasks, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        out_param = cursor.callproc("pkgmnusr_create_usr", [
            data.username
            , data.password
            , data.fstname
            , data.lstname
            , data.email
            , data.pos
            , data.role
            , None
            ])

        count = out_param[7]
        
        logger.info("Registration attempt for user data '%s completed with result after: %s", data, count)
        if count == 1:
            # background_tasks.add_task(
            #     send_registration_email
            #     , data.username
            #     , data.fstname
            #     , data.lstname
            #     , data.customercode
            #     , data.customername
            #     )
            return JSONResponse(content={"status": "success", "regis": "success"})
        elif count == 0:
            return JSONResponse(content={"status": "dup", "regis": "dup"})
        else :
            return JSONResponse(content={"status": "fail", "regis": "fail"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        cursor.close()
        conn.close()

# -------------------------- mnusr function end --------------------------




# -------------------------- pymnt function begin --------------------------

@app.post("/findCusCode")
def findCusCode(data: FindCuscode, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        out_param = cursor.callproc("pkgpymnt_find_cus_code", [
            data.username
            , None
            , None
        ])
        cusname = out_param[1]
        cuscode = out_param[2]
        conn.commit() 
        return JSONResponse(content={"status": "success", "cuscode": cuscode, "cusname":cusname})
    except Exception as e:
        conn.rollback()
        raise JSONResponse(content=HTTPException(status_code=500, detail=f"Unexpected error: {e}"))

    finally:
        conn.close() 

def get_current_date() -> str:
    now = datetime.now()
    return now.strftime('%Y%d%m')

def generate_token() -> str:
    logger.info("format date : %s", get_current_date())
    current_date = get_current_date()
    key = current_date + 'Chaitanachote'
    return hashlib.md5(key.encode('utf-8')).hexdigest()

def get_request_headers() -> dict:
    return {
        'Content-Type': 'application/json',
        'Token': generate_token(),
    }
    

def convert_decimal(value):
    return float(value) if isinstance(value, Decimal) else value

def format_date_ddmmyyyy(date_obj):
    """Convert a date object or string (YYYYMMDD) to 'DDMMYYYY' string format."""
    if isinstance(date_obj, date):
        return date_obj.strftime('%d%m%Y')
    elif isinstance(date_obj, str) and len(date_obj) == 8:
        try:
            return datetime.strptime(date_obj, '%Y%m%d').strftime('%d%m%Y')  
        except ValueError:
            return date_obj
    elif isinstance(date_obj, int):
        return str(date_obj)
    return str(date_obj)
    
    
# async def getDataFromSap(usrcuscode: str) -> List[Dict]:
#     api_url = 'https://sisapp.sisthai.com/payment/lists'
#     headers = get_request_headers()  
    
#     try:
#         response = requests.get(f"{api_url}?code={usrcuscode}", headers=headers, cookies=None)
#         logger.info(f"data from sap {response}")
#         if response.status_code == 200:
#             response_data = response.json()
#             if response_data.get('message') == 'Success':
#                 return response_data.get("data", {}).get("T_OUTSTANDING", [])
#             else:
#                 raise ValueError("Success message not found")
#         else:
#             raise HTTPException(status_code=response.status_code, detail="Failed to fetch data from SAP")
#     except Exception as e:
#         logger.error(f"Error in getDataFromSap: {e}")
#         raise HTTPException(status_code=500, detail=f"Error in getDataFromSap: {e}")
    
async def getDataFromSap(usrcuscode: str, conn) -> List[Dict]:
    try:
        parameters = {
            "I_COMPANY": "1000",
            "I_PAYER": usrcuscode
        }
        result = conn.call("Z_SD0003_GET_OUTSTANDING", **parameters)
        logger.info(f"data from SAP: {result}")

        # If your RFC returns a structure like {'T_OUTSTANDING': [...]}
        return result.get("T_OUTSTANDING", [])

    except (ABAPApplicationError, ABAPRuntimeError) as e:
        logger.error(f"SAP error: {e}")
        raise HTTPException(status_code=500, detail=f"SAP error occurred: {e}")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected error in getDataFromSap: {e}")

async def insertOutstandingData(conn, outstanding_data: List[Dict]):
    cursor = conn.cursor()
    
    try:
        for record in outstanding_data:
            try:
                doc_date = datetime.strptime(record["DOC_DATE"], "%Y%m%d").date()
                due_date = datetime.strptime(record["DUE_DATE"], "%Y%m%d").date()
            except ValueError as ve:
                logger.error(f"Invalid date format for record {record}: {ve}")
                continue
            
            status = None
            logger.info(f"Invalid date format for record {record}")
            
            cursor.callproc(
                "pkgpymnt_insert_pymdp_work",
                [   
                    record["PAYER"]
                    , record["DOC_TYPE_DISPLAY"]
                    , record["BILL_DOC"]
                    , doc_date
                    , due_date
                    , record["DOC_AMOUNT"]
                    , record["BALANCE_AMOUNT"]
                    , record["ASSIGNMENT"]
                    , status 
                ]
            )
            
            cursor.fetchone()
            
            if status == 'success':
                logger.info(f"Record for {record['BILL_DOC']} inserted successfully.")
            else:
                logger.warning(f"Record for {record['BILL_DOC']} already exists.")
                
        conn.commit()
        return "success"
    except Exception as e:
        logger.error(f"Error inserting outstanding data: {e}")
        raise HTTPException(status_code=500, detail=f"Error inserting outstanding data: {e}")
    finally:
        cursor.close()


        
@app.post("/loadData")
async def loadData(data: LoadDate, conn=Depends(get_mysql_connection)):
    cursor = conn.cursor()
    offset = (data.page_start - 1) * data.page_limit

    try:
        cursor.callproc("pkgpymnt_load_data", [
            data.usrcuscode,
            offset,
            data.page_limit
        ])
        conn.commit()

        results = []
        total_count = None
        for result in cursor.stored_results():
            if total_count is None:
                total_count = result.fetchone()[0]
            else:
                results = result.fetchall()

        if not results:
            return JSONResponse(content={"status": "success", "total": 0, "data": []})

        column_names = [desc[0] for desc in result.description]
        formatted_results = []

        for row in results:
            formatted_row = {}
            for i, column in enumerate(row):
                column_name = column_names[i]
                if isinstance(column, Decimal):
                    column = str(column)

                if column_name in ['pywdocdate', 'pywduedate']:
                    formatted_row[column_name] = format_date_ddmmyyyy(column)
                else:
                    formatted_row[column_name] = column

            formatted_results.append(formatted_row)

        return JSONResponse(content={"status": "success", "total": total_count, "data": formatted_results})

    except Exception as e:
        logger.error(f"Error loading data from procedure: {e}")
        raise HTTPException(status_code=500, detail=f"Error loading data from procedure: {e}")

    finally:
        cursor.close() 
 
@app.post("/getDataInvoice")
async def getDataInvoice(data: GetInv, conn=Depends(get_mysql_connection), conn_sap=Depends(get_sap_connection)):
    try:
        outstanding_data = await getDataFromSap(data.usrcuscode, conn_sap)
        
        status = await insertOutstandingData(conn, outstanding_data)

        if status == 'success':
            return JSONResponse(content={"status": "success"})
        else:
            return JSONResponse(content={"status": "fail"})

    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        if conn:
            conn.close()
            

            
@app.post("/updateflag")
async def updateflag(data: UpdateFlag, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        
        cursor.callproc("pkgpymnt_update_flag", [
            data.cuscode
            , data.selected
            , data.docno
            ])
        conn.commit()
        

        return JSONResponse(content={"status": "success"})

    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        if cursor:
            try:
                cursor.close()
            except Exception as e:
                logger.error(f"Error closing cursor: {e}")
        if conn:
            conn.close()
            
@app.post("/updatePaidAmt")
async def updatePaidAmt(data: UpdatePaidAmt, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        
        cursor.callproc("pkgpymnt_update_paid", [
            data.cuscode
            , data.docno
            , data.paidamt
            ])
        conn.commit()
        
        return JSONResponse(content={"status": "success"})

    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        if cursor:
            try:
                cursor.close()
            except Exception as e:
                logger.error(f"Error closing cursor: {e}")
        if conn:
            conn.close()
            
                        
@app.post("/updateAllflag")
async def updateAllflag(data: UpdateAllFlag, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        
        cursor.callproc("pkgpymnt_update_all_flag", [
            data.cuscode
            , data.flag
            ])
        conn.commit()

        return JSONResponse(content={"status": "success"})

    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        if cursor:
            try:
                cursor.close()
            except Exception as e:
                logger.error(f"Error closing cursor: {e}")
        if conn:                                                            
            conn.close()
            
            
@app.post("/findSumamt")
async def findSumamt(data: FindSumamt, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        
        out_param = cursor.callproc("pkgpymnt_find_sum_amt", [
            data.cuscode
            , None
            , None
        ])
        
        conn.commit() 
        sumamt = out_param[1]
        isSelect = out_param[2]
        
        sumamt = str(sumamt) if isinstance(sumamt, Decimal) else str(sumamt)
        isSelect = str(isSelect) if isinstance(isSelect, Decimal) else str(isSelect)

        return JSONResponse(content={"status": "Success", "sumamt": sumamt, "isSelect": isSelect})

    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        if cursor:
            try:
                cursor.close()
            except Exception as e:
                logger.error(f"Error closing cursor: {e}")
        if conn:
            try:
                conn.close()
            except Exception as e:
                logger.error(f"Error closing connection: {e}")
            
@app.post("/findfeeRate")
async def findfeeRate(data: FindFeeRate, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        
        out_param = cursor.callproc("pkgpymnt_find_fee_rate", [
            data.bank
            , data.card
            , None
            ])
        conn.commit()
        feeRate = out_param[2]

        return JSONResponse(content={"status": "Success", "feeRate": feeRate})

    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        if cursor:
            try:
                cursor.close()
            except Exception as e:
                logger.error(f"Error closing cursor: {e}")
        if conn:                                                            
            conn.close()
            
@app.post("/missingCn")
async def missingCn(data: FindSumamt, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        cursor.callproc("pkgpymnt_find_missing_cn", [
            data.cuscode
        ])
        conn.commit()

        formatted_results = []  

        for result in cursor.stored_results():
            rows = result.fetchall() 
            column_names = [desc[0] for desc in result.description]  
            formatted_results = [dict(zip(column_names, row)) for row in rows] 

        cursor.close()
        conn.close()
        return JSONResponse(content={"status": "Success", "data": formatted_results})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/createSo")
def createSo(data: CreateSo, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        out_param = cursor.callproc("pkgpymnt_insert_so", [
            data.cuscode
            , data.docType
            , data.docNo
            , data.docAmt
            , data.usage
            , data.note
            , None
            ])

        count = out_param[6]
        
        if count == 1:
            return JSONResponse(content={"status": "success", "dummy": "success"})
        elif count == 0:
            return JSONResponse(content={"status": "dup", "dummy": "dup"})
        else :
            return JSONResponse(content={"status": "fail", "dummy": "fail"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        cursor.close()
        conn.close()
           
    
@app.post("/getPayment")
async def getPayment(data: Payment, background_tasks: BackgroundTasks, conn=Depends(get_mysql_connection)):
    try:
        paymentNo = generatePayment()
        logger.info("paymentNo : %s", paymentNo)
        cursor = conn.cursor()
        cursor1 = conn.cursor()
        cursor2 = conn.cursor()
        out_param = cursor.callproc("pkgpymnt_insert_pymhdr", [
            data.username
            , data.cuscode
            , paymentNo
            , data.sumamt
            , data.fee
            , data.totalAmt
            , data.bank
            , data.card
            , None
        ])
        stat = out_param[8]
        
        if stat == 'success':
            cursor1.callproc("pkgpymnt_update_pymdp_work", [
                data.cuscode
            ])
            cursor2.callproc("pkgpymnt_find_data_payment", [
                paymentNo
                , data.card
            ])
            results = []
            for result in cursor2.stored_results():
                results = result.fetchall() 
                column_names = [desc[0] for desc in result.description] 
                break  

            formatted_results = [
                {column: convert_decimal(value) for column, value in zip(column_names, row)}
                for row in results
            ]
            
            payment_data = formatted_results[0]
            send_bank_data = SendBank(
                merchantId=payment_data['merchId'],
                amount=payment_data['totalamt'],
                orderRef=payment_data['paymentNo'],
                currCode="764",
                successUrl="",
                failUrl="",
                cancelUrl="",
                payType="N",
                lang="E",
                TxType="Retail",
                Term="",
                promotionType="",
                supplierId="",
                productId="",
                serialNo="",
                model="",
                itemTotal="",
                redeemPoint="",
                paymentSkip="",
                memberPay_service="",
                memberPay_memberId="",
                secureHash=payment_data['secureHash512']
            )
            
            logger.info(f"send_bank_data type: {type(send_bank_data)}")

            html = payment_sendbank(send_bank_data)
            num_characters = len(html)
            
            link = generateLink()
            cursor1.callproc("pkgpymnt_update_html", [
               paymentNo
               , link
               , html
            ])
            background_tasks.add_task(check_payment_status, paymentNo)
            
            conn.commit()

            
            logger.info("characters html : %s",num_characters)
            logger.info("html code : %s",html)
            return JSONResponse(content={"status": stat, "link": link , "paymentNo": paymentNo})
        else:
            logger.info("status insert header : %s", stat)
            return JSONResponse(content={"status": stat})
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        if cursor:
            try:
                cursor.close()
                cursor1.close()
                cursor2.close()
            except Exception as e:
                logger.error(f"Error closing cursor: {e}")
        if conn:
            conn.close()
        
def generatePayment():
    set_date = datetime.now().strftime("%Y%m%d%H%M%S")
    run_number = hashlib.sha1(str(random.randint(0, 1000000)).encode('utf-8')).hexdigest()[:7]
    return f"PIM{set_date}{run_number}"

def generateLink():
    set_date = datetime.now().strftime("%Y%m%d%H%M%S")
    run_number = hashlib.sha1(str(random.randint(0, 1000000)).encode('utf-8')).hexdigest()[:7]
    to_hash = run_number + str(set_date) 
    return f"Pay{to_hash}"


def payment_sendbank(data: SendBank):
    try:
        bank_url = 'https://testpaygate.ktc.co.th/ktc/eng/merchandize/payment/payForm.jsp'
        
        data_dict = data.dict() if isinstance(data, SendBank) else dict(data)
            
        response = requests.post(bank_url, data=data_dict)
        
        if response.status_code == 200:
            redirect_url = response.text
        else:
            redirect_url = "Error: Failed to get redirect URL"

        return redirect_url  
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"send bank fail: {e}")


async def check_payment_status(paymentNo:str):
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = conn.cursor()
        
        await asyncio.sleep(35*60)  
        bank_url = 'https://testpaygate.ktc.co.th/ktc/eng/merchant/api/orderApi.jsp'
        
        cursor.callproc("pkgpymnt_data_payment_to_check_bank", [
                paymentNo
            ])
        
        stored_results = list(cursor.stored_results())
        if not stored_results:
            logger.warning("No data returned from stored procedure.")
            return {"status": "no_data"}
        
        result = stored_results[0]
        results = result.fetchall()
        column_names = [desc[0] for desc in result.description]

        payment_list = [
            {column: convert_decimal(value) for column, value in zip(column_names, row)}
            for row in results
        ]
        logger.info("payment check : %s", payment_list)

        for payment in payment_list:
            prepare_data = {
                'merchantId': payment.get('merchId'),
                'loginId': payment.get('loginId'),
                'password': payment.get('password'),
                'actionType': "Query",
                'orderRef': payment.get('paymentNo'),
                'payRef': "",
            }
            try:
                response = requests.post(bank_url, data=prepare_data)
                root = ET.fromstring(response.text)
                record = root.find('record')
                if record is not None:
                    orderStatus = record.findtext('orderStatus')
                    ref = record.findtext('ref')
                    stat = "Y"
                    logger.info("Response orderStatus: %s", orderStatus)
                    logger.info("Response ref: %s", ref)
                    logger.info("Response stat: %s", stat)
                    cursor.callproc("pkgpymnt_update_status_payment", [
                        ref
                        , stat
                        , None
                    ])
            except Exception as e:
                logger.error("Error while sending to bank: %s", str(e))
        
        cursor.callproc("pkgpymnt_expire_payment", [
            paymentNo
            ])
        conn.commit()
        return JSONResponse(content={"check_payment_status": 'will check payment'})
    except Exception as e:
        logger.error(f"Error in background task: {e}")
    finally:
        cursor.close()
        conn.close()


# -------------------------- pymnt function end --------------------------


# -------------------------- hispage function begin --------------------------

@app.post("/searchPaymentData")
async def searchPaymentData(data: SearchPaymenthdr, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        offset = (data.page_start - 1) * data.page_limit
        
        cursor.callproc("pkghis001a_find_header_data", [
            data.cuscode
            , data.payNo
            , data.bank
            , data.card
            , data.creusr
            , data.credateFrom
            , data.credateTo
            , data.status
            , data.invNo
            , offset
            , data.page_limit
        ])
        conn.commit()

        results = []
        total_count = None
        for result in cursor.stored_results():
            if total_count is None:
                total_count = result.fetchone()[0]
            else:
                results = result.fetchall()

        if not results:
            return JSONResponse(content={"status": "success", "total": total_count, "data": []})

        column_names = [desc[0] for desc in result.description]
        formatted_results = []

        for row in results:
            formatted_row = {}
            for i, column in enumerate(row):
                column_name = column_names[i]
                if isinstance(column, Decimal):
                    column = str(column)

                if column_name in [ 'credate']:
                    formatted_row[column_name] = format_date_ddmmyyyy(column)
                else:
                    formatted_row[column_name] = column

            formatted_results.append(formatted_row)
        return JSONResponse(content={"status": "Success", "total": total_count, "data": formatted_results})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/findPaymentDetail")
async def findPaymentDetail(data: SearchPaymentdtl, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        offset = (data.page_start - 1) * data.page_limit
        
        cursor.callproc("pkghis001b_find_detail_data", [
            data.hdrid
            , offset
            , data.page_limit
        ])
        conn.commit()

        results = []
        total_count = None
        for result in cursor.stored_results():
            if total_count is None:
                total_count = result.fetchone()[0]
            else:
                results = result.fetchall()

        if not results:
            return JSONResponse(content={"status": "success", "total": total_count, "data": []})

        column_names = [desc[0] for desc in result.description]
        formatted_results = []

        for row in results:
            formatted_row = {}
            for i, column in enumerate(row):
                column_name = column_names[i]
                if isinstance(column, Decimal):
                    column = str(column)

                if column_name in [ 'dueDate', 'docDate']:
                    formatted_row[column_name] = format_date_ddmmyyyy(column)
                else:
                    formatted_row[column_name] = column

            formatted_results.append(formatted_row)
        return JSONResponse(content={"status": "Success", "total": total_count, "data": formatted_results})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------- hispage function end --------------------------

# -------------------------- KTC begin --------------------------

@app.get("/ktc/callBank/{payNo}/{link}")
def ktcCallBank(payNo: str,  link: str, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        out_param = cursor.callproc("pkgpymnt_get_html", [
          payNo
          , link
          , None
          ])

        html = out_param[2]  
        
        if html is None:
            html_expired = """
            <html>
              <head>
                <title>Link Expired</title>
                <style>
                  body {
                    margin: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    text-align: center;
                    font-family: Arial, sans-serif;
                  }
                  .container {
                    max-width: 600px;
                    padding: 20px;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h2>Link Expired</h2>
                  <p>Your link has expired. Please request a new link or contact support if you believe this is an error.</p>
                </div>
              </body>
            </html>
            """
            return HTMLResponse(content=html_expired, status_code=404)

        updated_html_content = html.replace(
            'action="payForm2.jsp"', 
            'action="https://testpaygate.ktc.co.th/ktc/eng/merchandize/payment/payForm2.jsp"'
        )
        updated_html_content = updated_html_content.replace(
            'form.action =  "payTPN.jsp"', 
            'action="https://testpaygate.ktc.co.th/ktc/eng/merchandize/payment/payTPN.jsp"'
        )
        
        updated_html_content = updated_html_content.replace(
            'form.action =  "payForm2.jsp"', 
            'action="https://testpaygate.ktc.co.th/ktc/eng/merchandize/payment/payForm2.jsp"'
        )
        
        logger.info("HTML Code : %s", updated_html_content)

        return HTMLResponse(content=updated_html_content)

    except Exception as e:
        logger.error(f"Error in ktcCallBank: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.post("/ktc/datafeed")
async def ktc_datafeed(data: Request, background_tasks: BackgroundTasks, conn=Depends(get_mysql_connection)):
    logger.info("dataFrombank : %s", data)

    form_data = await data.form()
    logger.info("Parsed form data: %s", form_data)

    successcode = form_data.get("successcode")
    ref = form_data.get("ref")
    amt = form_data.get("amt")
    
    if successcode == '0':
        stat = "Y"
    else :
        stat = "F"
    
    logger.info("data.successcode : %s", successcode)
    logger.info("stat request : %s", stat)
    logger.info("ref doc : %s", ref)
    logger.info("ref amt : %s", amt)
    try:
        cursor = conn.cursor()
        
        out_param = cursor.callproc("pkgpymnt_update_pymdtl", [
            ref
            , stat
            , None
        ])
        status = out_param[2]
        cursor.nextset() 
        logger.info("Update pymdtl : %s", status)
        print("OK")
        if status == "success":  
            background_tasks.add_task(
                send_payment_email
                , ref
                , stat
                , amt
                )
            return JSONResponse(content={"status": "Success" , "datail": ref })
        else:
            background_tasks.add_task(
                send_payment_email
                , ref
                , stat
                , amt
                )
            return JSONResponse(content={"status": "fail"})
    except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing the payment data: {e}")


def send_payment_email(ref: str, stat: str, amt: str):
    conn = get_mysql_connection()
    cursor = conn.cursor()
    out_param = cursor.callproc("pkgpymnt_find_email", [
           ref
           , None
           , None
           , None
           , None
           , None
       ])
    eamil = out_param[1]
    cuscode = out_param[2]
    sumamt = clean_and_format_amount(out_param[3])
    feeamt = clean_and_format_amount(out_param[4])
    ttamt = clean_and_format_amount(out_param[5])
    
    cursor.callproc("pkgpymnt_find_invoice", [
           ref
       ])
    
    invoice = []  
    for result in cursor.stored_results():
        rows = result.fetchall() 
        column_names = [desc[0] for desc in result.description]  
        invoice = [dict(zip(column_names, row)) for row in rows] 
        
        
    table_rows = ""
    for inv in invoice:
        invno = inv.get('invno', '')
        invnoAmt = clean_and_format_amount(str(inv.get('amt', '0')))
        invnopaid = clean_and_format_amount(str(inv.get('paid', '0')))
        table_rows += f"""
            <tr>
                <td style="text-align:center;">{invno}</td>
                <td style="text-align:right;">{invnoAmt}</td>
                <td style="text-align:right;">{invnopaid}</td>
            </tr>
        """
    if stat == 'Y':
        status = 'Payment completed' 
        statush = 'Success'
    elif stat == 'F':
        status = 'Payment Failed' 
        statush = 'Failed'
    sender_email = "Chaitanachote@sisthai.com"
    sender_password = "New@191243"
    subject = f"[Payment Link] {statush} - Customer Code: {cuscode} , Payment No: {ref} , Amount: {ttamt}"
    email= eamil
    cc_list = ["Chaitanachote@sisthai.com"]
    thailand_tz = pytz.timezone("Asia/Bangkok")
    current_datetime = datetime.now(thailand_tz).strftime("%H:%M:%S %d/%m/%Y")
    
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = email
    message["Cc"] = ", ".join(cc_list)
    message["Subject"] = subject
    body = f"""
        <html>
            <body>
                <div style="white-space: pre; font-family: monospace;">
                    <p><strong>Customer Code    :</strong> {cuscode}</p>
                    <p><strong>Payment No       :</strong> {ref}</p>
                    <p><strong>Amount           :</strong> {sumamt}</p>
                    <p><strong>Fee Amount       :</strong> {feeamt}</p>
                    <p><strong>Total Amount     :</strong> {ttamt}</p>
                    <p><strong>Status           :</strong> {status}</p>
                    <p><strong>Date Time        :</strong> {current_datetime}</p>
                </div>
                <table border="1" cellspacing="0" cellpadding="5">
                    <tr>
                        <th style="background-color:#f2f2f2; text-align:left;">Invoice No</th>
                        <th style="background-color:#f2f2f2; text-align:left;">Amount</th>
                        <th style="background-color:#f2f2f2; text-align:left;">Paid Amount</th>
                    </tr>
                    {table_rows}
                </table>
                <br>
                <br>
                <br>
                <p>Chaitanachote Wongtanaruj</p>
                <p>Information System Officer</p>
                <br>
                <p>SiS Distribution (Thailand) Public Co., Ltd.</p>
                <p>Mobile : 091-812-9900</p>
                <p>Email : chaitanachote@sisthai.com</p>
               
            </body>
        </html>
    """
    message.attach(MIMEText(body, "html"))
    try: 
        logger.info("Connecting to SMTP server...")
        server = smtplib.SMTP("172.21.130.12", 25)
        server.login(sender_email, sender_password)
        logger.info("Login successful!")
        server.sendmail(sender_email, email, message.as_string())
        
        server.quit()
        logger.info("Email sent successfully!")
    except Exception as e:
        logger.info(f"Failed to send email: {e}")
        
        
def clean_and_format_amount(amt):
    match = re.search(r'\d+(?:\.\d{1,2})?', amt)
    if match:
        number = float(match.group())
        return f"{number:,.2f}"
    else:
        return "Invalid amount"
        
# -------------------------- KTC end ----------------------------

# -------------------------- Batch Jobs ebegin -----------------------
def job_send_data_notes():
    conn = get_mysql_connection()
    cursor = None  
    try:
        cursor = conn.cursor() 
        cursor.callproc("pkgpymnt_prepare_data_send_notes")
        
        for result in cursor.stored_results():
            results = result.fetchall()
            column_names = [desc[0] for desc in result.description]
            break 

        billing = [
            {column: convert_decimal(value) for column, value in zip(column_names, row)}
            for row in results
        ]

        logger.info("billing : %s", billing)

        if not billing:
            return JSONResponse(content={"detail": "No billing data found for the provided payment number"})
            
        prepare_data_list = []
        for billing_data in billing:
            prepare_data = {
                'company_code': billing_data.get('company_code'),
                'customer_code': billing_data.get('customer_code'),
                'payment_type': billing_data.get('payment_type'),
                'billing_no': billing_data.get('billing_no'),
                'payment_doc': billing_data.get('payment_doc'),
                'assignment': billing_data.get('assignment'),
                'billing_date': str(billing_data.get('billing_date')),
                'billing_due_date': str(billing_data.get('billing_due_date')), 
                'amount': billing_data.get('amount'),
                'amount_total': billing_data.get('amount_total'),
                'bank_status': billing_data.get('bank_status'),
                'bank_approve_ref': billing_data.get('bank_approve_ref'),
                'payment_method': billing_data.get('payment_method'),
                'payment_no': billing_data.get('payment_no'),
                'source': billing_data.get('source'),
                'approve_date': str(billing_data.get('approve_date')), 
                'approve_time': str(billing_data.get('approve_time')), 
                'reason_code': billing_data.get('reason_code'),
            }
            prepare_data_list.append(prepare_data)

        payment_data_list = []
        for prepare_data in prepare_data_list:
            payment_data = {
                'COMPANY_CODE': prepare_data['company_code'],
                'PAYER_CODE': prepare_data['customer_code'],
                'CUST_CODE': prepare_data['customer_code'],
                'PAYMENT_TYPE': prepare_data['payment_type'],
                'DOC_NO': prepare_data['billing_no'],
                'PAYMENT_DOC': prepare_data['payment_doc'],
                'ASSIGNMENT': prepare_data['assignment'],
                'DOC_DATE': prepare_data['billing_date'],
                'DUE_DATE': prepare_data['billing_due_date'],
                'AMOUNT': prepare_data['amount'],
                'PAID_AMT': prepare_data['amount_total'],
                'STATUS': prepare_data['bank_status'],
                'APPROVAL_CODE': prepare_data['bank_approve_ref'],
                'PAYMENT_METHODE': prepare_data['payment_method'],
                'ORDER_NO': prepare_data['payment_no'],
                'SOURCE': prepare_data['source'],
                'PAYMENT_NO': prepare_data['payment_no'],
                'APPROVAL_CODE_DATE': prepare_data['approve_date'],
                'APPROVAL_CODE_TIME': prepare_data['approve_time'],
                'REASON_CODE': prepare_data['reason_code']
            }
            payment_data_list.append(payment_data)
            
        
        all_success = True
        try:
            for payment_data in payment_data_list:
                wsdl = WSDL_URL
                method = METHOD
                result = call_soap_api(wsdl, method, payment_data)
                logger.info("Response from notes : %s", result)
                if result:  
                    out_param = cursor.callproc("pkgpymnt_send_notes_success", [
                        payment_data['PAYMENT_NO'],
                        None
                    ])
                    status = out_param[1]
                    cursor.nextset() 
                    
                    if status != 'success':
                        all_success = False 
                else:
                    return JSONResponse(content={"status": "send notes fail"})
                
            if all_success:
                logger.info("Update notes_success : %s", all_success)
                return JSONResponse(content={"status": status})
            else:
                logger.info("Update notes_success : %s", all_success)
                return JSONResponse(content={"status": status})
        except Exception as e:
            logger.error(f"Error processing payment data: {e}")
            raise HTTPException(status_code=500, detail=f"Error processing the payment data: {e}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing the payment data: {e}")

    finally:
        if cursor:
            cursor.close() 
        if conn:
            conn.close() 
            
# @app.post("/test-checkpayment")      
async def job_check_payment_form_bank(): 
    conn = get_mysql_connection()
    if not conn.is_connected():
        logger.error("Database connection failed.")
        raise HTTPException(status_code=500, detail="Database connection failed.")
        
    try:
        cursor = conn.cursor()
        bank_url = 'https://testpaygate.ktc.co.th/ktc/eng/merchant/api/orderApi.jsp'
        
        cursor.callproc("pkgpymnt_find_payment_check_bank")
        
        stored_results = list(cursor.stored_results())
        if not stored_results:
            logger.warning("No data returned from stored procedure.")
            return {"status": "no_data"}
        
        result = stored_results[0]
        results = result.fetchall()
        column_names = [desc[0] for desc in result.description]

        payment_list = [
            {column: convert_decimal(value) for column, value in zip(column_names, row)}
            for row in results
        ]
        logger.info("payment check : %s", payment_list)

        for payment in payment_list:
            prepare_data = {
                'merchantId': payment.get('merchId'),
                'loginId': payment.get('loginId'),
                'password': payment.get('password'),
                'actionType': "Query",
                'orderRef': payment.get('paymentNo'),
                'payRef': "",
            }
            logger.info("Sending to bank: %s", prepare_data)
            try:
                response = requests.post(bank_url, data=prepare_data)
                logger.info("Response status code: %s", response.status_code)
                logger.info("Response body: %s", response.text)
            
                root = ET.fromstring(response.text)
                record = root.find('record')
                if record is not None:
                    orderStatus = record.findtext('orderStatus')
                    ref = record.findtext('ref')
                    stat = "Y"
                    logger.info("Response orderStatus: %s", orderStatus)
                    logger.info("Response ref: %s", ref)
                    logger.info("Response stat: %s", stat)
                    cursor.callproc("pkgpymnt_update_status_payment", [
                        ref
                        , stat
                        , None
                    ])
            except Exception as e:
                logger.error("Error while sending to bank: %s", str(e))

        return {"status": "success"}
    except Exception as e:
        logger.error("Unhandled exception: %s", str(e)) 
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

async def job_hourly_sequence():
    await job_check_payment_form_bank()
    job_send_data_notes()


@app.on_event("startup")
def start_scheduler():
    scheduler.add_job(
       job_hourly_sequence,
       trigger='cron',
       minute=0,
       id='job_hourly_sequence',
       max_instances=2,
       coalesce=True
    )
    scheduler.start()
    logger.info("Scheduler started!")

@app.on_event("shutdown")
def shutdown_scheduler():
    scheduler.shutdown()
    logger.info("Scheduler stopped!")
                
@app.post("/start-scheduler")
def start_manual_scheduler():
    if not scheduler.running:
        scheduler.add_job(
           job_hourly_sequence,
           trigger='cron',
           minute=0,
           id='job_hourly_sequence',
           max_instances=2,
           coalesce=True
        )
        scheduler.start()
        return {"status": "Scheduler started"}
    return {"status": "Scheduler is already running"}

@app.post("/stop-scheduler")
def stop_manual_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        return {"status": "Scheduler stopped"}
    return {"status": "Scheduler is not running"}
b''
# -------------------------- Batch Jobs end --------------------------
# -------------------------- Test load data begin --------------------------
@app.post("/load_data_from_sap/")
async def load_data_from_sap(request: Request, conn=Depends(get_sap_connection)):
    try:
        body = await request.json()
        customer_code = body.get("customer_code")
        if not customer_code:
            raise HTTPException(status_code=400, detail="customer_code is required")

        parameters = {"I_COMPANY": "1000", "I_PAYER": customer_code}
        result = conn.call("Z_SD0003_GET_OUTSTANDING", **parameters)
        return {"status": "success", "data": result}
    except (ABAPApplicationError, ABAPRuntimeError) as e:
        raise HTTPException(status_code=500, detail=f"SAP error occurred: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

# -------------------------- Test load data end ----------------------------

# call back
@app.get("/kbank/notify/")
def notify():
        return JSONResponse(content={"status": "success", "data": "callback success!"})

@app.get("/ktb/success/")
def ktb_success():
        return JSONResponse(content={"status": "success", "data": "success!"})
    
@app.get("/ktb/fail/")
def ktb_fail():
        return JSONResponse(content={"status": "success", "data": "fail!"})
    
@app.get("/ktb/cancel/")
def ktb_cancel():
        return JSONResponse(content={"status": "success", "data": "cancel!"})

@app.get("/")
def hello():
        return JSONResponse(content={"status": "success", "data": "Hello!"})
              
@app.get("/example/")
def example_route():
    return JSONResponse(content={"status": "success", "data": "Example response"})

@app.get("/test-api/example/")
def example_route():
    return JSONResponse(content={"status": "success", "data": "Example response"})

