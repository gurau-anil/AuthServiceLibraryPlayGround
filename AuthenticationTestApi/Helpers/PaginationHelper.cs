namespace AuthenticationTestApi.Helpers
{

    public class PagedResult<T>
    {

        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
        public IEnumerable<T> Items { get; set; }
    }

    public static class PaginationHelper
    {
        public static PagedResult<T> GetPaged<T>(
            this IQueryable<T> query, int page, int pageSize)
        {
            var totalCount = query.Count();
            var items = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            return new PagedResult<T>
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                Items = items
            };
        }
    }
}
