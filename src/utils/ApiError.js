class ApiError extends Error{
    constructor(
        stausCode,
        message = "Something Went Wrong",
        error = [],
        statck = ""
    ){
        super(message)
        this.statusCode = stausCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = error

        if(statck){
            this.statck = statck
        }else{
            Error.captureStackTrace(this , this.constructor)
        }
    }
}