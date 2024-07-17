import logging
import os



class CustomLogger(logging.Logger):
    """
    Custom logger class to override
    """
    
    def info(self, msg, *args, **kwargs):
        """
        Function to log the message if DEBUG_MODE is True or the message starts with "DEBUG:"
        
        """
        
        # Check if the message should be logged
        global DEBUG_MODE
        if DEBUG_MODE:
            super().info(msg, *args, **kwargs)
            
        # Check if the message starts with "DEBUG:"
        elif msg.startswith("DEBUG:"):
            msg = msg.replace("DEBUG:", "")
            super().info(msg, *args, **kwargs)
            
            

def setup_logger(name, log_file, level=logging.DEBUG):
    """
    Function to setup as many loggers as you want.
    
    Level of logger can be set to DEBUG, INFO, WARNING, ERROR, CRITICAL
    
    Parameters:
    name: name of the logger
    log_file: name of the log file
    
    Returns:
    logger: the logger object
    """
    
    # Set the format of the log
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    
    # Create a file handler for the log
    handler = logging.FileHandler(log_file)       
    # Set the format of the file handler
    handler.setFormatter(formatter)

    # Create a stream handler for the log
    stream_handler = logging.StreamHandler()
    # Set the format of the stream handler
    stream_handler.setFormatter(formatter)

    # Create a logger
    logging.setLoggerClass(CustomLogger)
    logger = logging.getLogger(name)
    logger.setLevel(level) 
    logger.addHandler(handler)
    logger.addHandler(stream_handler)

    return logger


def set_debug_mode(debug_mode):
    """
    Function to set the debug mode of the logger.
    Then, reinstantiate the logger with the new debug mode.
    
    Parameters:
    debug_mode: boolean value to set the debug mode of the logger
    """
    
    global DEBUG_MODE
    DEBUG_MODE = debug_mode
    
    # Reinitialize the logger with the new debug mode
    global logger
    logger = setup_logger("logger", log_file_path, logging.DEBUG)
    


# Set the environment variables
LOGS_DIR = os.getenv("LOGS_DIR", "./logs")
if not os.path.exists(LOGS_DIR):
    os.makedirs(LOGS_DIR)

# Set the debug mode of the logger
DEBUG_MODE = False

log_file_path = os.path.join(LOGS_DIR, "learn-smart.log")

# Create a default logger for the application
logger = setup_logger("logger", log_file_path, logging.DEBUG)
