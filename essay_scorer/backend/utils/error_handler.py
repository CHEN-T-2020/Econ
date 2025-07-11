from flask import jsonify
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def handle_api_error(error: Exception, message: str = "An error occurred"):
    """统一处理API错误"""
    error_message = str(error)
    logger.error(f"{message}: {error_message}")
    
    # 根据错误类型返回不同的状态码
    if isinstance(error, ValueError):
        return jsonify({"error": error_message}), 400
    elif isinstance(error, FileNotFoundError):
        return jsonify({"error": "Resource not found"}), 404
    elif isinstance(error, RuntimeError):
        return jsonify({"error": error_message}), 500
    else:
        return jsonify({"error": message}), 500

def validate_request_data(data: dict, required_fields: list) -> tuple[bool, str]:
    """验证请求数据"""
    if not data:
        return False, "No data provided"
    
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    
    return True, ""

def sanitize_input(text: str) -> str:
    """清理输入文本"""
    if not text:
        return ""
    
    # 移除潜在的恶意字符
    dangerous_chars = ['<script>', '</script>', 'javascript:', 'onerror=']
    sanitized = text
    for char in dangerous_chars:
        sanitized = sanitized.replace(char, '')
    
    return sanitized.strip() 