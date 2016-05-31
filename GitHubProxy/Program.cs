using Nito.AsyncEx;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace GitHubProxy
{
    class Program
    {
        static void Main(string[] args)
        {
            AsyncContext.Run(() => Run(null, null));
        }

        public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
        {
            try
            {
                log.Info($"C# HTTP trigger function processed a request. RequestUri={req.RequestUri}");
                string gCode = req.GetQueryNameValuePairs()
                   .FirstOrDefault(q => string.Compare(q.Key, "gCode", true) == 0)
                   .Value;

                if (gCode == null)
                    return req.CreateResponse(HttpStatusCode.BadRequest, "Please pass a valid GitHub code on the query string with the key as gCode.");

                Dictionary<string, string> data = new Dictionary<string, string>();
                data.Add("client_id", "53c1eb0d00a1ef6bf9ce");
                data.Add("client_secret", "108dd9e6d05061c0a1ffa9adc11befc5ddc59403");
                data.Add("redirect_uri", "http://localhost:8080/authorize.html");
                data.Add("code", gCode);

                var jsonString = "{" + System.Environment.NewLine;
                for (int i = data.Count - 1; i >= 0; i--)
                {
                    var kvp = data.ElementAt(i);
                    if (kvp.Value == null) { continue; }

                    jsonString += $"\"{kvp.Key}\":\"{kvp.Value}\"";

                    if (i == 0) { break; }

                    jsonString += "," + System.Environment.NewLine;
                }

                jsonString += "}";


                var httpClient = new HttpClient();
                var tokenRequest = new HttpRequestMessage(HttpMethod.Post, new Uri("https://github.com/login/oauth/access_token"));
                tokenRequest.Content = new StringContent(jsonString, System.Text.Encoding.UTF8, "application/json");

                var tokenResponse = await httpClient.SendAsync(tokenRequest);
                var responseContent = await tokenResponse.Content.ReadAsStringAsync();
                return req.CreateResponse(HttpStatusCode.OK, responseContent);
            }
            catch (Exception ex)
            {
                var message = "";
                while (ex != null)
                {
                    message += ex.Message;
                    ex = ex.InnerException;
                }
                return req.CreateResponse(HttpStatusCode.InternalServerError, message);
            }
        }
    }

    internal class TraceWriter
    {
        internal void Info(string v)
        {
            Console.WriteLine(v);
        }
    }
}
