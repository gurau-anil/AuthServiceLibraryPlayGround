﻿namespace AuthServiceLibrary.Exceptions
{
    public class BusinessRuleException : Exception
    {
        public BusinessRuleException(string? message) : base(message)
        {
        }
    }
}
