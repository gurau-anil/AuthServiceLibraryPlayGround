using System.Net;

namespace AuthenticationTestApi.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var (statusCode, errorMessage) = GetStatusCodeAndMessage(exception);
            context.Response.StatusCode = (int)statusCode;

            var response = new { error = errorMessage };
            await context.Response.WriteAsJsonAsync(response);
        }

        private static (HttpStatusCode statusCode, string errorMessage) GetStatusCodeAndMessage(Exception exception)
        {
            switch (exception)
            {
                case ArgumentException argEx:
                    return (HttpStatusCode.BadRequest, argEx.Message); // 400
                case KeyNotFoundException keyEx:
                    return (HttpStatusCode.NotFound, keyEx.Message); // 404
                case FileNotFoundException fileEx:
                    return (HttpStatusCode.NotFound, fileEx.Message); //404
                case NotImplementedException notImplementedEx:
                    return (HttpStatusCode.NotImplemented, notImplementedEx.Message); //501
                case UnauthorizedAccessException authEx:
                    return (HttpStatusCode.Unauthorized, authEx.Message); // 401
                                                        // Add more specific exception handling here
                default:
                    return (HttpStatusCode.InternalServerError, "An unexpected error occurred."); // 500
            }
        }
    }
}
