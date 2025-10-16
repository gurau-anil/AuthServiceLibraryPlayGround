using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace AuthenticationTestApi.Hubs
{
    public class AuthHub: Hub
    {
        //lots of uses concurrently login, so ConcurrentDictionary dictionary should for thread safety
        private static readonly ConcurrentDictionary<string, HashSet<string>> _onlineUsers = new();

        public override async Task OnConnectedAsync()
        {
            await AddToOnlineUser();

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await RemoveFromOnlineUser();

            await base.OnDisconnectedAsync(exception);
        }


        public async Task GetOnlineUserCount()
        {
            await Clients.All.SendAsync("OnlineUserCount", _onlineUsers.Count);
        }
        public async Task LoginEvent()
        {
            await AddToOnlineUser();
        }

        public async Task LogoutEvent()
        {
            await RemoveFromOnlineUser();
        }

        private async Task AddToOnlineUser()
        {
            var userId = Context.User.Identity.Name;

            if (!string.IsNullOrEmpty(userId))
            {
                _onlineUsers.AddOrUpdate(
                    userId,
                    _ => new HashSet<string> { Context.ConnectionId },
                    (_, existing) => { lock (existing) { existing.Add(Context.ConnectionId); } return existing; }
                );

                Console.WriteLine($"{userId} connected. Total users: {_onlineUsers.Count}");
                await Clients.All.SendAsync("OnlineUserCount", _onlineUsers.Count);

            }
        }

        private async Task RemoveFromOnlineUser()
        {
            var userId = Context.User.Identity.Name;

            if (!string.IsNullOrEmpty(userId))
            {
                if (_onlineUsers.TryGetValue(userId, out var connections))
                {
                    lock (connections)
                    {
                        connections.Remove(Context.ConnectionId);

                        if (connections.Count == 0)
                        {
                            _onlineUsers.TryRemove(userId, out _);
                        }
                    }

                    Console.WriteLine($"{userId} disconnected. Total users: {_onlineUsers.Count}");
                    await Clients.All.SendAsync("OnlineUserCount", _onlineUsers.Count);

                }
            }
        }
    }
}
