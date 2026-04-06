import httpx
import asyncio
import os
import json
from dotenv import load_dotenv

# Tải cấu hình từ .env
load_dotenv("/home/blong711/.gemini/antigravity/scratch/ai-business-agent/.env")

async def test_customcat_tracking(reference_order_id: str):
    api_key = os.getenv("CUSTOMCAT_API_KEY")
    base_url = "https://customcat-beta.mylocker.net"
    url = f"{base_url}/api/v1/order/status/{reference_order_id}"
    
    print(f"Checking CustomCat Order: {reference_order_id}")
    print(f"Using API Key: {api_key[:5]}...{api_key[-5:]}")
    
    async with httpx.AsyncClient() as client:
        try:
            # CustomCat yêu cầu api_key truyền qua query params hoặc body
            response = await client.get(url, params={"api_key": api_key}, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                print("\n✅ API Response received:")
                print(json.dumps(data, indent=2, ensure_ascii=False))
                
                # Trích xuất thông tin tracking
                raw_shipments = data.get('SHIPMENTS', [])
                if raw_shipments:
                    print("\n📦 Tracking Information Found:")
                    for ship in raw_shipments:
                        tid = ship.get('TRACKING_ID')
                        carrier = ship.get('VENDOR')
                        print(f"- Carrier: {carrier}, Tracking ID: {tid}")
                else:
                    print("\nℹ️ No shipments found yet.")
                    
            else:
                print(f"\n❌ Error {response.status_code}: {response.text}")
                
        except Exception as e:
            print(f"\n☢️ Connection Error: {str(e)}")

# Chạy test
if __name__ == "__main__":
    test_id = "040426112-5521724-1268201ff1"
    asyncio.run(test_customcat_tracking(test_id))
