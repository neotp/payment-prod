from decimal import Decimal
from fastapi import FastAPI, Request, HTTPException, Depends, logger
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
# from pyrfc import Connection, ABAPApplicationError, ABAPRuntimeError, LogonError, CommunicationError
from pydantic import BaseModel, Field
from typing import Dict, List
import mysql.connector
import datetime
import random
import string
import logging
import hashlib
from datetime import date, datetime
import requests

app = FastAPI()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
# SAP and MySQL Configurations
# SAP_CONFIG = {
#     "ashost": "172.21.130.208"
#     , "sysnr": "00"
#     , "client": "110"
#     , "user": "notes"
#     , "passwd": "february_02"
# }
origins = [
    "http://localhost:4200",
    "http://webapp.sisthai:4200",
    "http://localhost:7070",
    "http://webapp.sisthai:7070",
    "http://172.31.144.1:7070",
    "http://172.31.20.11:7070",
    # "http://your-angular-domain.com"  # Add your production domain here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MYSQL_CONFIG = {
    "host": "172.31.50.11"
    , "user": "root"
    , "password": "P@ssw0rdSiS"
    , "database": "payment_db"
}

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

    
class UpdateDateUser(BaseModel):
    usrname: str
    usrrole: str
    usrstat: str
    
 
class FindCuscode(BaseModel):
    username: str
    
class GetInv(BaseModel):
    usrcuscode: str
    
class Payment(BaseModel):
    username: str
    cuscode: str
    
    
class UpdateFlag(BaseModel):
    selected: bool
    cuscode: str
    docno: str
    
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
    
class TestSubmit(BaseModel):
    merchantId: str = Field(..., description="Merchant ID")
    amount: float = Field(..., description="Payment amount")
    orderRef: str = Field(..., description="Order reference")
    currCode: str = Field(..., description="Currency code")
    successUrl: str = Field(..., description="URL for success")
    failUrl: str = Field(..., description="URL for failure")
    cancelUrl: str = Field(..., description="URL for cancellation")
    payType: str = Field(..., description="Payment type")
    lang: str = Field(default="E", description="Language")
    TxType: str = Field(..., description="Transaction type")
    Term: str = Field(..., description="Term information")
    promotionType: str = Field(..., description="Promotion type")
    supplierId: str = Field(..., description="Supplier ID")
    productId: str = Field(..., description="Product ID")
    serialNo: str = Field(..., description="Serial number")
    model: str = Field(..., description="Model information")
    itemTotal: str = Field(..., description="Total items")
    redeemPoint: str = Field(..., description="Redeem points")
    paymentSkip: str = Field(..., description="Payment skip flag")
    memberPay_service: str = Field(..., description="Member pay service")
    memberPay_memberId: str = Field(..., description="Member pay member ID")
    secureHash: str = Field(..., description="Secure hash for validation")
    
# Dependency: SAP Connection
# def get_sap_connection():
#     try:
#         return Connection(**SAP_CONFIG)
#     except CommunicationError:
#         raise HTTPException(status_code=500, detail="Could not connect to SAP server.")
#     except LogonError:
#         raise HTTPException(status_code=401, detail="Could not log in to SAP.")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Unexpected SAP error: {e}")

# Dependency: MySQL Connection 
def get_mysql_connection():
    try:
        return mysql.connector.connect(**MYSQL_CONFIG)
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"MySQL connection error: {err}")


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
            return JSONResponse(content={"status": "success", "role": role})
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials or user not active")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        cursor.close()
        conn.close()

@app.post("/register")
def login(data: RegisterData, conn=Depends(get_mysql_connection)):
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
            return JSONResponse(content={"status": "success", "regis": "success"})
        elif count == 0:
            return JSONResponse(content={"status": "success", "regis": "dup"})
        else :
            return JSONResponse(content={"status": "success", "regis": "fail"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        cursor.close()
        conn.close()

# -------------------------- login function end --------------------------
        
        
# -------------------------- mnusr function begin --------------------------

@app.post("/findDataPending")
def findDataPending(data: DataPending,conn=Depends(get_mysql_connection)):
    
    offset = (data.page_start - 1) * data.page_limit
    
    try:
        cursor1 = conn.cursor()
        cursor2 = conn.cursor()
        
        cursor1.callproc("pkgmnusr_insert_usrpss_work")
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

        logger.info("datadip: %s", results)

        for result in cursor2.stored_results():
            results = result.fetchall()
            column_names = [desc[0] for desc in result.description]  
            formatted_results = [dict(zip(column_names, row)) for row in results]
        
        logger.info("total: %s", total_count)
        logger.info("data: %s", formatted_results)
        
        if result:
            return JSONResponse(content={"status": "success", "total": total_count, "data": formatted_results})
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials or user not active")
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        if cursor1:
            try:
                cursor1.close()
            except Exception as e:
                logger.error(f"Error closing cursor1: {e}")
        
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
        
        cursor.callproc("pkgmnusr_reload_usrpss_work")
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
def updateDataToWork(conn=Depends(get_mysql_connection)):
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
    
async def getDataFromSap(usrcuscode: str) -> List[Dict]:
    api_url = 'https://sisapp.sisthai.com/payment/lists'
    headers = get_request_headers()  
    
    try:
        response = requests.get(f"{api_url}?code={usrcuscode}", headers=headers, cookies=None)
        logger.info(f"data from sap {response}")
        if response.status_code == 200:
            response_data = response.json()
            if response_data.get('message') == 'Success':
                return response_data.get("data", {}).get("T_OUTSTANDING", [])
            else:
                raise ValueError("Success message not found")
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch data from SAP")
    except Exception as e:
        logger.error(f"Error in getDataFromSap: {e}")
        raise HTTPException(status_code=500, detail=f"Error in getDataFromSap: {e}")
    
    
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
            
            cursor.callproc(
                "pkgpymnt_insert_pymdp_work",
                [   
                    record["PAYER"],
                    record["DOC_TYPE_DISPLAY"],
                    record["BILL_DOC"],
                    doc_date,
                    due_date,
                    record["DOC_AMOUNT"],
                    record["BALANCE_AMOUNT"],
                    status  # Output parameter for status
                ]
            )
            
            # Fetch the status from the stored procedure
            cursor.fetchone()  # This is necessary to get the output of the procedure
            
            if status == 'success':
                logger.info(f"Record for {record['BILL_DOC']} inserted successfully.")
            else:
                logger.warning(f"Record for {record['BILL_DOC']} already exists.")
                
        conn.commit()
        return "success"  # Return success if everything goes fine
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

        logger.info("Total count: %s", total_count)
        logger.info("Data: %s", formatted_results)

        return JSONResponse(content={"status": "success", "total": total_count, "data": formatted_results})

    except Exception as e:
        logger.error(f"Error loading data from procedure: {e}")
        raise HTTPException(status_code=500, detail=f"Error loading data from procedure: {e}")

    finally:
        cursor.close() 
 
@app.post("/getDataInvoice")
async def getDataInvoice(data: GetInv, conn=Depends(get_mysql_connection)):
    try:
        outstanding_data = await getDataFromSap(data.usrcuscode)
        logger.info("data from outstanding : %s", outstanding_data)
        
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
    
    
@app.post("/getPayment")
async def getPayment(data: Payment, conn=Depends(get_mysql_connection)):
    try:
        paymentNo = generatePayment()
        cursor = conn.cursor()
        cursor1 = conn.cursor()
        cursor2 = conn.cursor()
        out_param = cursor.callproc("pkgpymnt_insert_pymhdr", [
            data.username
            , data.cuscode
            , paymentNo
            , None
        ])
        stat = out_param[3]
        
        if stat == 'success':
            cursor1.callproc("pkgpymnt_update_pymdp_work", [
                data.cuscode
            ])
            cursor2.callproc("pkgpymnt_find_data_payment", [
                paymentNo
            ])
             
        conn.commit()
        results = []
        for result in cursor2.stored_results():
            results = result.fetchall() 
            column_names = [desc[0] for desc in result.description] 
            break  

        formatted_results = [
            {column: convert_decimal(value) for column, value in zip(column_names, row)}
            for row in results
        ]
        
        logger.info("data from table pymdp_work : %s", formatted_results)

        return JSONResponse(content={"status": stat, "data": formatted_results})

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
    run_number = ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))
    return f"PIM{set_date}{run_number}"

# -------------------------- pymnt function end --------------------------

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


@app.post("/submit-payment")
async def submit_payment(data: TestSubmit):
    try:
        return JSONResponse(content={"message": "Payment data received", "data": data.dict()})
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing the payment data: {e}")
