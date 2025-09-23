namespace AuthenticationTestApi.Attributes
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class MergeFieldValueAttribute : Attribute
    {
        public string Value { get; }

        public MergeFieldValueAttribute(string value)
        {
            Value = value;
        }
    }
}
