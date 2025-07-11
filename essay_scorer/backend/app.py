from flask import Flask, send_from_directory
from flask_cors import CORS
from config import Config
from api.routes import api_bp
import os

def create_app():
    """创建Flask应用"""
    app = Flask(__name__, static_folder=Config.STATIC_FOLDER, static_url_path='/')
    
    # 配置应用
    app.config['SECRET_KEY'] = Config.SECRET_KEY
    app.config['DEBUG'] = Config.DEBUG
    
    # 启用CORS
    CORS(app)
    
    # 注册API蓝图
    app.register_blueprint(api_bp)
    
    # 前端路由处理
    @app.route('/')
    def index():
        return send_from_directory(Config.STATIC_FOLDER, 'index.html')
    
    @app.route('/<path:path>')
    def catch_all(path):
        return send_from_directory(Config.STATIC_FOLDER, 'index.html')
    
    return app

def main():
    """主函数"""
    try:
        # 验证配置
        Config.validate()
        
        # 创建应用
        app = create_app()
        
        # 启动服务器
        app.run(
            host="0.0.0.0", 
            port=Config.PORT,
            debug=Config.DEBUG
        )
    except Exception as e:
        print(f"Failed to start application: {e}")
        exit(1)

if __name__ == '__main__':
    main() 