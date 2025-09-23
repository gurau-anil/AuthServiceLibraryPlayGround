using AuthenticationTestApi.Models.MergeField;
using Scriban;

namespace AuthenticationTestApi.Helpers
{
    public static class MergeFieldHelper
    {
        public static string PopulateMergeFields(string content, object model)
        {
            return Template.Parse(content).Render(model);
        }
    }
}
