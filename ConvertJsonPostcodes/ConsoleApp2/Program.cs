using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp2
{
    class Program
    {
        static void Main(string[] args)
        {
            TextInfo myTI = new CultureInfo("en-AU", false).TextInfo;
            List<Suburb> items = new List<Suburb>(); ;
            using (StreamReader r = new StreamReader("australian_postcodes.json"))
            {
                string json = r.ReadToEnd();
                items = JsonConvert.DeserializeObject<List<Suburb>>(json);
            }


            List<compactSuburb> nswOnly = new List<compactSuburb>();
            foreach (var item in items)
            {
                if (item.state == "NSW" && item.type == "Delivery Area" && !item.locality.EndsWith(" DC"))
                {
                    item.locality = myTI.ToTitleCase(item.locality.ToLower());
                    nswOnly.Add(new compactSuburb()
                    {
                        id = item.id,
                        lat = item.lat,
                        locality = item.locality,
                        lon = item.lon,
                        postcode = item.postcode
                    }
                    );


                }
            }

            var jsonWrite = JsonConvert.SerializeObject(nswOnly, Formatting.None);
            File.WriteAllText("nsw_postcodes.json", jsonWrite, Encoding.UTF8);
        }
    }



    public class Suburb
    {
        public int id { get; set; }
        public string postcode { get; set; }
        public string locality { get; set; }
        public string state { get; set; }
        [JsonProperty("long")]
        public float lon { get; set; }
        public float lat { get; set; }

        public string type { get; set; }

        public string SA2_NAME_2016 { get; set; }

    }

    public class compactSuburb
    {
        public int id { get; set; }
        public string postcode { get; set; }
        public string locality { get; set; }
        public float lat { get; set; }
        public float lon { get; set; }

    }
}
