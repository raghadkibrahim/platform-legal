from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Platform Legal"
    ENV: str = "dev"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./app.db"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)

settings = Settings()
