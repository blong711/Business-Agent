import asyncio
from langchain_core.messages import HumanMessage
from langchain_anthropic import ChatAnthropic
from dotenv import load_dotenv
import os

load_dotenv()

async def test():
    llm = ChatAnthropic(model="claude-3-haiku-20240307", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))
    response = await llm.ainvoke([HumanMessage(content="Hello")])
    print("response_metadata:", response.response_metadata)
    print("usage_metadata:", getattr(response, "usage_metadata", "Not found"))

asyncio.run(test())
