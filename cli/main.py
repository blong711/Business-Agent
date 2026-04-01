import typer
import httpx
import json
import asyncio

app = typer.Typer(help="AI Business Agent CLI")

# Cấu hình Agent API (Mặc định khi chạy Docker)
AGENT_API_URL = "http://localhost:8000/api/v1/chat"

@app.command()
def chat():
    """
    Kích hoạt chế độ trò chuyện (Interactive Chat) qua terminal.
    """
    typer.echo("--- 🤖 Đang kết nối tới AI Business Agent... ---")
    typer.echo("(Gõ 'exit' hoặc 'quit' để thoát)")
    
    while True:
        user_input = typer.prompt("You")
        if user_input.lower() in ["exit", "quit"]:
            typer.echo("Tạm biệt!")
            break
            
        try:
            # Gửi tin nhắn tới Backend API qua HTTP
            response = httpx.post(
                AGENT_API_URL, 
                json={"message": user_input, "user_id": "cli_user"},
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                typer.secho(f"Bot [{data['intent']}]: {data['response']}", fg=typer.colors.GREEN)
            else:
                typer.secho(f"Lỗi kết nối API Backend: {response.text}", fg=typer.colors.RED)
                
        except Exception as e:
            typer.secho(f"Lỗi: {str(e)}", fg=typer.colors.RED)

if __name__ == "__main__":
    app()
