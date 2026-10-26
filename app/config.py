from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Se puede cambiar con una variable de entorno o un archivo .env
    database_url: str = "sqlite:///./coqueta.db"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
