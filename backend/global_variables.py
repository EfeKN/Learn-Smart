import platform

class GlobalVariables:
    _instance = None
    
    """
    A singleton class to store global variables.
    """

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GlobalVariables, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        self._variables = {}

    def set_variable(self, key, value):
        """
        Set a global variable. If the variable already exists, it will be overwritten.
        """
        self._variables[key] = value
    
    def get_variable(self, key, default=None):
        return self._variables.get(key, default)

    def delete_variable(self, key):
        if key in self._variables:
            del self._variables[key]

    def list_variables(self):
        return self._variables.keys()
