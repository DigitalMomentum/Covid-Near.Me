using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Create_Sitemap.Models;
using Newtonsoft.Json;

namespace Create_Sitemap {
	class Program {
		static string domain = "https://www.covid-near.me";

		static string[] urls = new string[] { 
			"/",
			"/Disclaimer",
			"/Privacy",
			"/Sources",
			"/nsw"
		};
		static void Main(string[] args) {
			
			List<SitemapNode> nodes = new List<SitemapNode>();

			foreach(string url in urls) {
				nodes.Add(
				new SitemapNode() {
					Url = url,
					Priority = 1
				});
			}

			

		

			using (StreamReader r = new StreamReader("C:\\_Data\\Dev\\Covid-Near.Me\\nsw-case-locations\\src\\assets\\data\\nsw_postcodes.json")) {
				string json = r.ReadToEnd();
				List<compactSuburb> items = JsonConvert.DeserializeObject<List<compactSuburb>>(json);

				foreach (var suburb in items) {
					nodes.Add(
				new SitemapNode() {
					Url = $"/nsw/{suburb.locality}",
					Priority = 1
				});
				}
			}

			var sitemapStr = GetSitemapDocument(nodes);

			File.WriteAllText("C:\\_Data\\Dev\\Covid-Near.Me\\nsw-case-locations\\src\\assets\\sitemap.xml", sitemapStr);

		}


		public static string GetSitemapDocument(IEnumerable<SitemapNode> sitemapNodes) {
			XNamespace xmlns = "http://www.sitemaps.org/schemas/sitemap/0.9";
			XElement root = new XElement(xmlns + "urlset");

			foreach (SitemapNode sitemapNode in sitemapNodes) {
				XElement urlElement = new XElement(
					xmlns + "url",
					new XElement(xmlns + "loc", Uri.EscapeUriString(domain + sitemapNode.Url)),
					sitemapNode.LastModified == null ? null : new XElement(
						xmlns + "lastmod",
						sitemapNode.LastModified.Value.ToLocalTime().ToString("yyyy-MM-ddTHH:mm:sszzz")),
					sitemapNode.Frequency == null ? null : new XElement(
						xmlns + "changefreq",
						sitemapNode.Frequency.Value.ToString().ToLowerInvariant()),
					sitemapNode.Priority == null ? null : new XElement(
						xmlns + "priority",
						sitemapNode.Priority.Value.ToString("F1", CultureInfo.InvariantCulture)));
				root.Add(urlElement);
			}

			XDocument document = new XDocument(root);
			return document.ToString();
		}


		public class compactSuburb {
			public int id { get; set; }
			public string postcode { get; set; }
			public string locality { get; set; }
			public float lat { get; set; }
			public float lon { get; set; }

		}
	}
}
