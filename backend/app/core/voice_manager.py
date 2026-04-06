import os
from elevenlabs.client import ElevenLabs
from elevenlabs.types import VoiceSettings
from fastapi.responses import StreamingResponse
import io

class VoiceManager:
    def __init__(self):
        self.api_key = os.getenv("ELEVENLABS_API_KEY")
        self.voice_id = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM") # default Rachel
        self.model_id = os.getenv("ELEVENLABS_MODEL_ID", "eleven_multilingual_v2")
        
        if self.api_key:
            self.client = ElevenLabs(api_key=self.api_key)
        else:
            self.client = None

    def text_to_speech(self, text: str):
        if not self.client:
            raise Exception("Chưa cấu hình ELEVENLABS_API_KEY trong file .env")

        try:
            # Clean text (remove markdown symbols for better audio)
            clean_text = text.replace("*", "").replace("#", "").replace("- ", "").replace("`", "")
            
            # Use ElevenLabs to generate audio
            audio_generator = self.client.text_to_speech.convert(
                text=clean_text,
                voice_id=self.voice_id,
                model_id=self.model_id,
                output_format="mp3_44100_128",
                voice_settings=VoiceSettings(
                    stability=0.4,
                    similarity_boost=0.8,
                    style=0.0,
                    use_speaker_boost=True
                )
            )
            
            # Since the SDK returns a generator/bytes depending on how it's called
            # Let's ensure we return a generator for StreamingResponse
            return audio_generator
                
        except Exception as e:
            print(f"--- [TTS] LỖI: {e} ---")
            raise e

voice_manager = VoiceManager()
