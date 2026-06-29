from fastapi import APIRouter, Depends
from src.api.dependencies import get_current_user

api_router = APIRouter()

# Placeholder routers for future modules
auth_router = APIRouter()
clinic_router = APIRouter(dependencies=[Depends(get_current_user)])
grooming_router = APIRouter(dependencies=[Depends(get_current_user)])
crm_router = APIRouter(dependencies=[Depends(get_current_user)])
inventory_router = APIRouter(dependencies=[Depends(get_current_user)])
hr_router = APIRouter(dependencies=[Depends(get_current_user)])

@auth_router.post("/login")
async def login():
    return {"message": "Login endpoint"}

@clinic_router.get("/appointments")
async def get_appointments():
    return {"data": []}

@clinic_router.post("/medical-records")
async def create_medical_record():
    return {"message": "Medical record created"}

@grooming_router.get("/appointments")
async def get_grooming_appointments():
    return {"data": []}

@crm_router.get("/clients")
async def get_clients():
    return {"data": []}

@inventory_router.get("/products")
async def get_products():
    return {"data": []}

@hr_router.get("/staff")
async def get_staff():
    return {"data": []}

api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(clinic_router, prefix="/clinic", tags=["Clinic (Vet)"])
api_router.include_router(grooming_router, prefix="/grooming", tags=["Grooming (Shampooch)"])
api_router.include_router(crm_router, prefix="/crm", tags=["CRM"])
api_router.include_router(inventory_router, prefix="/inventory", tags=["Inventory"])
api_router.include_router(hr_router, prefix="/hr", tags=["HR & Staff"])
