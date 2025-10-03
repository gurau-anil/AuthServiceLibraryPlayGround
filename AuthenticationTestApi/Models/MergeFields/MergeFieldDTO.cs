using AuthenticationTestApi.Attributes;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace AuthenticationTestApi.Models.MergeFields
{
    public class MergeFieldDTO
    {
        public string Title { get; set; }
        public string Value { get; set; }

        public List<MergeFieldDTO> Get(Type type)
        {
            List<MergeFieldDTO> retVal = new List<MergeFieldDTO>();
            var properties = type.GetProperties();
            MergeFieldValueAttribute? attribute;
            foreach (var property in properties)
            {
                attribute = property.GetCustomAttribute<MergeFieldValueAttribute>();
                if(attribute is not null)
                {
                    retVal.Add(
                        new MergeFieldDTO
                        {
                            Title = String.Join(' ', attribute.Value.Split('_').Select(c => Char.ToUpper(c[0])+c.Substring(1))),
                            Value = attribute.Value
                        } 
                    );
                }
            }

            return retVal;
        }
    }
}
