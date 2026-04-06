from backend.app.core.llm_manager import llm_manager
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import asyncio

load_dotenv()

async def test():
    llm = llm_manager.get_chat_model()
    print(f"Testing with model: {llm.model_name if hasattr(llm, 'model_name') else 'unknown'}")
    response = await llm.ainvoke([HumanMessage(content="Hello, who are you?")])
    print("Content:", response.content)
    print("usage_metadata:", getattr(response, "usage_metadata", "Not found"))

if __name__ == "__main__":
    asyncio.run(test())
