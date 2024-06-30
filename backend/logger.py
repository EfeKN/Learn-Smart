import logging
import os

LOG_DIR = "logs"

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
    logger = logging.getLogger(name)
    logger.setLevel(level) 
    logger.addHandler(handler)
    logger.addHandler(stream_handler)

    return logger


if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

log_file_path = os.path.join(LOG_DIR, "learn-smart.log")

# Create a default logger for the application
logger = setup_logger("logger", log_file_path, logging.DEBUG)
