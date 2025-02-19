from fastapi import FastAPI, Request, HTTPException, Depends
from pyrfc import Connection, ABAPApplicationError, ABAPRuntimeError, LogonError, CommunicationError
from pydantic import BaseModel
from typing import List
import mysql.connector
import datetime
import random
import string

app = FastAPI()

# SAP and MySQL Configurations
SAP_CONFIG = {
    "ashost": "172.21.130.208"
    , "sysnr": "00"
    , "client": "110"
    , "user": "notes"
    , "passwd": "february_02"
}

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

class Payment(BaseModel):
    invno: str
    docamt: str
    balamt: str
    docdate: str
    duedate: str
    
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

@app.post("/load_data/")
async def load_data(request: Request, conn=Depends(get_sap_connection)):
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

@app.get("/testquery/")
def testquery(conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        cursor.callproc("GetUsrpssData")
        
        cursor.execute("SELECT @result;") 
        result = cursor.fetchall()
        return {"status": "success", "data": result}
    finally:
        cursor.close()
        conn.close()

@app.post("/login/")
def login(data: LoginData, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        out_param = cursor.callproc("login", [
            data.username
            , data.password
            , None
            ])
        role = out_param[2]

        if role:
            return {"status": "success", "role": role}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials or user not active")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        cursor.close()
        conn.close()

@app.post("/register/")
def login(data: RegisterData, conn=Depends(get_mysql_connection)):
    try:
        cursor = conn.cursor()
        out_param = cursor.callproc("regisuser", [
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

        count = out_param[2]
        if count:
            return {"status": "success"}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials or user not active")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {e}")
    finally:
        cursor.close()
        conn.close()

@app.post("/getPayment/")
async def get_payment(data: Payment, conn=Depends(get_mysql_connection)):
    try:
        sumamt = sum(item.docamt for item in data.details)  # Sum the document amounts
        payment_no = generatePayment()
        cursor = conn.cursor()

        # Insert header
        cursor.callproc("pymhdr", [
            payment_no,
            sumamt
        ])

        # Insert details
        for item in data.details:
            cursor.callproc("pymdtl", [
                payment_no,
                item.invno,
                item.docamt,
                item.balamt,
                item.docdate,
                item.duedate,
                0
            ])
        conn.commit() 
        return {"status": "success", "payment_no": payment_no}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

    finally:
        conn.close() 

def generatePayment():
    set_date = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    run_number = ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))
    return f"PIM{set_date}{run_number}"

# call back
@app.get("/kbank/notify/")
def notify():
        return {"status": "success", "data": "callback success!"}

@app.get("/ktb/success/")
def ktb_success():
        return {"status": "success", "data": "success!"}
    
@app.get("/ktb/fail/")
def ktb_fail():
        return {"status": "success", "data": "fail!"}
    
@app.get("/ktb/cancel/")
def ktb_cancel():
        return {"status": "success", "data": "cancel!"}

@app.get("")
def hello():
        return {"status": "success", "data": "Hello!"}
        