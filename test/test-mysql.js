var mysql = require('mysql');
var titles = ['isotonia', 'isotonic', 'isotonicity', 'isotony', 'isotope', 'isotopic', 'isotopism', 'isotopy', 'isotrehalose', 'Isotria', 'isotrimorphic', 'isotrimorphism', 'isotrimorphous', 'isotron', 'isotrope', 'isotropic', 'isotropism', 'isotropous', 'isotropy', 'isotype', 'isotypic', 'isotypical', 'isovalerate', 'isovalerianate', 'isovalerianic', 'isovaleric', 'isovalerone', 'isovaline', 'isovanillic', 'isovoluminal', 'isoxanthine', 'isoxazine', 'isoxazole', 'isoxime', 'isoxylene', 'isoyohimbine', 'isozooid', 'ispaghul', 'ispravnik', 'Israel', 'Israeli', 'Israelite', 'Israeliteship', 'Israelitic', 'Israelitish', 'Israelitism', 'Israelitize', 'issanguila', 'Issedoi', 'Issedones', 'issei', 'issite', 'issuable', 'issuably', 'issuance', 'issuant', 'issue', 'issueless', 'issuer', 'issuing', 'ist', 'isthmi', 'Isthmia', 'isthmial', 'isthmian', 'isthmiate', 'isthmic', 'isthmoid', 'isthmus', 'istiophorid', 'Istiophoridae', 'Istiophorus', 'istle', 'istoke', 'Istrian', 'Istvaeones', 'isuret', 'isuretine', 'Isuridae', 'isuroid', 'Isurus', 'Iswara', 'it', 'Ita', 'itabirite', 'itacism', 'itacist', 'itacistic', 'itacolumite', 'itaconate', 'itaconic', 'Itala', 'Itali', 'Italian', 'Italianate', 'Italianately', 'Italianation', 'Italianesque', 'Italianish', 'Italianism', 'Italianist', 'Italianity', 'Italianization', 'Italianize', 'Italianizer', 'Italianly', 'Italic', 'Italical', 'Italically', 'Italican', 'Italicanist', 'Italici', 'Italicism', 'italicization', 'italicize', 'italics', 'Italiote', 'italite', 'Italomania', 'Italon', 'Italophile', 'itamalate', 'itamalic', 'itatartaric', 'itatartrate', 'Itaves', 'itch', 'itchiness', 'itching', 'itchingly', 'itchless', 'itchproof', 'itchreed', 'itchweed', 'itchy', 'itcze', 'Itea', 'Iteaceae', 'Itelmes', 'item', 'iteming', 'itemization', 'itemize', 'itemizer', 'itemy', 'Iten', 'Itenean', 'iter', 'iterable', 'iterance', 'iterancy', 'iterant', 'iterate', 'iteration', 'iterative', 'iteratively', 'iterativeness', 'Ithaca', 'Ithacan', 'Ithacensian', 'ithagine', 'Ithaginis', 'ither', 'Ithiel', 'ithomiid', 'Ithomiidae', 'Ithomiinae', 'ithyphallic', 'Ithyphallus', 'ithyphyllous', 'itineracy', 'itinerancy', 'itinerant', 'itinerantly', 'itinerarian', 'Itinerarium', 'itinerary', 'itinerate', 'itineration', 'itmo', 'Ito', 'Itoism', 'Itoist', 'Itoland', 'Itonama', 'Itonaman', 'Itonia', 'itonidid', 'Itonididae', 'itoubou', 'its', 'itself', 'Ituraean', 'iturite', 'Itylus', 'Itys', 'Itza', 'itzebu', 'iva', 'Ivan', 'ivied', 'ivin', 'ivoried', 'ivorine', 'ivoriness', 'ivorist', 'ivory', 'ivorylike', 'ivorytype', 'ivorywood', 'ivy', 'ivybells', 'ivyberry', 'ivyflower', 'ivylike', 'ivyweed', 'ivywood', 'ivywort', 'iwa', 'iwaiwa', 'iwis', 'Ixia', 'Ixiaceae', 'Ixiama', 'Ixil', 'Ixion', 'Ixionian', 'Ixodes', 'ixodian', 'ixodic', 'ixodid', 'Ixodidae', 'Ixora', 'iyo', 'Izar', 'izar', 'izard', 'Izcateco', 'Izchak', 'Izdubar', 'izle', 'izote', 'iztle', 'Izumi', 'izzard', 'Izzy', 'J', 'j', 'Jaalin', 'jab', 'Jabarite', 'jabbed', 'jabber', 'jabberer', 'jabbering', 'jabberingly', 'jabberment', 'Jabberwock', 'jabberwockian', 'Jabberwocky', 'jabbing', 'jabbingly', 'jabble', 'jabers', 'jabia', 'jabiru', 'jaborandi', 'jaborine', 'jabot', 'jaboticaba', 'jabul', 'jacal', 'Jacaltec', 'Jacalteca', 'jacamar', 'Jacamaralcyon', 'jacameropine', 'Jacamerops', 'jacami', 'jacamin', 'Jacana', 'jacana', 'Jacanidae', 'Jacaranda', 'jacare', 'jacate', 'jacchus', 'jacent', 'jacinth', 'jacinthe', 'Jack', 'jack', 'jackal', 'jackanapes', 'jackanapish', 'jackaroo', 'jackass', 'jackassery', 'jackassification', 'jackassism', 'jackassness', 'jackbird', 'jackbox', 'jackboy', 'jackdaw', 'jackeen', 'jacker', 'jacket', 'jacketed', 'jacketing', 'jacketless', 'jacketwise', 'jackety', 'jackfish', 'jackhammer', 'jackknife', 'jackleg', 'jackman', 'jacko', 'jackpudding', 'jackpuddinghood', 'jackrod', 'jacksaw', 'jackscrew', 'jackshaft', 'jackshay', 'jacksnipe', 'Jackson', 'Jacksonia', 'Jacksonian', 'Jacksonite', 'jackstay', 'jackstone', 'jackstraw', 'jacktan', 'jackweed', 'jackwood', 'Jacky', 'Jackye', 'Jacob', 'jacobaea', 'jacobaean', 'Jacobean', 'Jacobian', 'Jacobic', 'Jacobin', 'Jacobinia', 'Jacobinic', 'Jacobinical', 'Jacobinically', 'Jacobinism', 'Jacobinization', 'Jacobinize', 'Jacobite', 'Jacobitely', 'Jacobitiana', 'Jacobitic', 'Jacobitical', 'Jacobitically', 'Jacobitish', 'Jacobitishly', 'Jacobitism', 'jacobsite', 'Jacobson', 'jacobus', 'jacoby', 'jaconet', 'Jacqueminot', 'Jacques', 'jactance', 'jactancy', 'jactant', 'jactation', 'jactitate', 'jactitation', 'jacu', 'jacuaru', 'jaculate', 'jaculation', 'jaculative', 'jaculator', 'jaculatorial', 'jaculatory', 'jaculiferous', 'Jacunda', 'jacutinga', 'jadder', 'jade', 'jaded', 'jadedly', 'jadedness', 'jadeite', 'jadery', 'jadesheen', 'jadeship', 'jadestone', 'jadish', 'jadishly', 'jadishness', 'jady', 'jaeger', 'jag', 'Jaga', 'Jagannath', 'Jagannatha', 'jagat', 'Jagatai', 'Jagataic', 'Jagath', 'jager', 'jagged', 'jaggedly', 'jaggedness', 'jagger', 'jaggery', 'jaggy', 'jagir', 'jagirdar', 'jagla', 'jagless', 'jagong', 'jagrata', 'jagua', 'jaguar', 'jaguarete', 'Jahve', 'Jahvist', 'Jahvistic', 'jail', 'jailage', 'jailbird', 'jaildom', 'jailer', 'jaileress', 'jailering', 'jailership', 'jailhouse', 'jailish', 'jailkeeper', 'jaillike', 'jailmate', 'jailward', 'jailyard', 'Jaime', 'Jain', 'Jaina', 'Jainism', 'Jainist', 'Jaipuri', 'jajman', 'Jake', 'jake', 'jakes', 'jako', 'Jakob', 'Jakun', 'Jalalaean', 'jalap', 'jalapa', 'jalapin', 'jalkar', 'jalloped', 'jalopy', 'jalouse', 'jalousie', 'jalousied', 'jalpaite', 'Jam', 'jam', 'jama', 'Jamaica', 'Jamaican', 'jaman', 'jamb', 'jambalaya', 'jambeau', 'jambo', 'jambolan', 'jambone', 'jambool', 'jamboree', 'Jambos', 'jambosa', 'jambstone', 'jamdani', 'James', 'Jamesian', 'Jamesina', 'jamesonite', 'jami', 'Jamie', 'jamlike', 'jammedness', 'jammer', 'jammy', 'Jamnia', 'jampan', 'jampani', 'jamrosade', 'jamwood', 'Jan', 'janapa', 'janapan', 'Jane', 'jane', 'Janet', 'jangada', 'Janghey', 'jangkar', 'jangle', 'jangler', 'jangly', 'Janice', 'janiceps', 'Janiculan', 'Janiculum', 'Janiform', 'janissary', 'janitor', 'janitorial', 'janitorship', 'janitress', 'janitrix', 'Janizarian', 'Janizary', 'jank', 'janker', 'jann', 'jannock', 'Janos', 'Jansenism', 'Jansenist', 'Jansenistic', 'Jansenistical', 'Jansenize', 'Janthina', 'Janthinidae', 'jantu', 'janua', 'Januarius', 'January', 'Janus', 'Januslike', 'jaob', 'Jap', 'jap', 'japaconine', 'japaconitine', 'Japan', 'japan', 'Japanee', 'Japanese', 'Japanesque', 'Japanesquely', 'Japanesquery', 'Japanesy', 'Japanicize', 'Japanism', 'Japanization', 'Japanize', 'japanned', 'Japanner', 'japanner', 'japannery', 'Japannish', 'Japanolatry', 'Japanologist', 'Japanology', 'Japanophile', 'Japanophobe', 'Japanophobia', 'jape', 'japer', 'japery', 'Japetus', 'Japheth', 'Japhetic', 'Japhetide', 'Japhetite', 'japing', 'japingly', 'japish', 'japishly', 'japishness', 'Japonic', 'japonica', 'Japonically', 'Japonicize', 'Japonism', 'Japonize', 'Japonizer', 'Japygidae', 'japygoid', 'Japyx', 'Jaqueline', 'Jaquesian', 'jaquima', 'jar', 'jara', 'jaragua', 'jararaca', 'jararacussu', 'jarbird', 'jarble', 'jarbot', 'jardiniere', 'Jared', 'jarfly', 'jarful', 'jarg', 'jargon', 'jargonal', 'jargoneer', 'jargonelle', 'jargoner', 'jargonesque', 'jargonic', 'jargonish', 'jargonist', 'jargonistic', 'jargonium', 'jargonization', 'jargonize', 'jarkman', 'Jarl', 'jarl', 'jarldom', 'jarless', 'jarlship', 'Jarmo', 'jarnut', 'jarool', 'jarosite', 'jarra', 'jarrah', 'jarring', 'jarringly', 'jarringness', 'jarry', 'jarvey', 'Jarvis', 'jasey', 'jaseyed', 'Jasione', 'Jasminaceae', 'jasmine', 'jasmined', 'jasminewood', 'Jasminum', 'jasmone', 'Jason', 'jaspachate', 'jaspagate', 'Jasper', 'jasper', 'jasperated', 'jaspered', 'jasperize', 'jasperoid', 'jaspery', 'jaspidean', 'jaspideous', 'jaspilite', 'jaspis', 'jaspoid', 'jasponyx', 'jaspopal', 'jass', 'jassid', 'Jassidae', 'jassoid', 'Jat', 'jatamansi', 'Jateorhiza', 'jateorhizine', 'jatha', 'jati', 'Jatki', 'Jatni', 'jato', 'Jatropha', 'jatrophic', 'jatrorrhizine', 'Jatulian', 'jaudie', 'jauk', 'jaun', 'jaunce', 'jaunder', 'jaundice', 'jaundiceroot', 'jaunt', 'jauntie', 'jauntily', 'jauntiness', 'jauntingly', 'jaunty', 'jaup', 'Java', 'Javahai', 'javali', 'Javan', 'Javanee', 'Javanese', 'javelin', 'javelina', 'javeline', 'javelineer', 'javer', 'Javitero', 'jaw', 'jawab', 'jawbation', 'jawbone', 'jawbreaker', 'jawbreaking', 'jawbreakingly', 'jawed', 'jawfall', 'jawfallen', 'jawfish', 'jawfoot', 'jawfooted', 'jawless', 'jawsmith', 'jawy', 'Jay', 'jay', 'Jayant', 'Jayesh', 'jayhawk', 'jayhawker', 'jaypie', 'jaywalk', 'jaywalker', 'jazerant', 'Jazyges', 'jazz', 'jazzer', 'jazzily', 'jazziness', 'jazzy', 'jealous', 'jealously', 'jealousness', 'jealousy', 'Jeames', 'Jean', 'jean', 'Jean-Christophe', 'Jean-Pierre', 'Jeanette', 'Jeanie', 'Jeanne', 'Jeannette', 'Jeannie', 'Jeanpaulia', 'jeans', 'Jeany', 'Jebus', 'Jebusi', 'Jebusite', 'Jebusitic', 'Jebusitical', 'Jebusitish', 'jecoral', 'jecorin', 'jecorize', 'jed', 'jedcock', 'jedding', 'jeddock', 'jeel', 'jeep', 'jeer', 'jeerer', 'jeering', 'jeeringly', 'jeerproof', 'jeery', 'jeewhillijers', 'jeewhillikens', 'Jef', 'Jeff', 'jeff', 'jefferisite', 'Jeffersonia', 'Jeffersonian', 'Jeffersonianism', 'jeffersonite', 'Jeffery', 'Jeffie', 'Jeffrey', 'Jehovah', 'Jehovic', 'Jehovism', 'Jehovist', 'Jehovistic', 'jehu', 'jehup', 'jejunal', 'jejunator', 'jejune', 'jejunely', 'jejuneness', 'jejunitis', 'jejunity', 'jejunoduodenal', 'jejunoileitis', 'jejunostomy', 'jejunotomy', 'jejunum', 'jelab', 'jelerang', 'jelick', 'jell', 'jellica', 'jellico', 'jellied', 'jelliedness', 'jellification', 'jellify', 'jellily', 'jelloid', 'jelly', 'jellydom', 'jellyfish', 'jellyleaf', 'jellylike', 'Jelske', 'jelutong', 'Jem', 'jemadar', 'Jemez', 'Jemima', 'jemmily', 'jemminess', 'Jemmy', 'jemmy', 'Jenine', 'jenkin', 'jenna', 'jennerization', 'jennerize', 'jennet', 'jenneting', 'Jennie', 'jennier', 'Jennifer', 'Jenny', 'jenny', 'Jenson', 'jentacular', 'jeofail', 'jeopard', 'jeoparder', 'jeopardize', 'jeopardous', 'jeopardously', 'jeopardousness', 'jeopardy', 'jequirity', 'Jerahmeel', 'Jerahmeelites', 'Jerald', 'jerboa', 'jereed', 'jeremejevite', 'jeremiad', 'Jeremiah', 'Jeremian', 'Jeremianic', 'Jeremias', 'Jeremy', 'jerez', 'jerib', 'jerk', 'jerker', 'jerkily', 'jerkin', 'jerkined', 'jerkiness', 'jerkingly', 'jerkish', 'jerksome', 'jerkwater', 'jerky', 'jerl', 'jerm', 'jermonal', 'Jeroboam', 'Jerome', 'Jeromian', 'Jeronymite', 'jerque', 'jerquer', 'Jerrie', 'Jerry', 'jerry', 'jerryism', 'Jersey', 'jersey', 'Jerseyan', 'jerseyed', 'Jerseyite', 'Jerseyman', 'jert', 'Jerusalem', 'jervia', 'jervina', 'jervine', 'Jesper', 'Jess', 'jess', 'jessakeed', 'jessamine', 'jessamy', 'jessant', 'Jesse', 'Jessean', 'jessed', 'Jessica', 'Jessie', 'jessur', 'jest', 'jestbook', 'jestee', 'jester', 'jestful', 'jesting', 'jestingly', 'jestingstock', 'jestmonger', 'jestproof', 'jestwise', 'jestword', 'Jesu', 'Jesuate', 'Jesuit', 'Jesuited', 'Jesuitess', 'Jesuitic', 'Jesuitical', 'Jesuitically', 'Jesuitish', 'Jesuitism', 'Jesuitist', 'Jesuitize', 'Jesuitocracy', 'Jesuitry', 'Jesus', 'jet', 'jetbead', 'jete', 'Jethro', 'Jethronian', 'jetsam', 'jettage', 'jetted', 'jetter', 'jettied', 'jettiness', 'jettingly', 'jettison', 'jetton', 'jetty', 'jettyhead', 'jettywise', 'jetware', 'Jew', 'jewbird', 'jewbush', 'Jewdom', 'jewel', 'jeweler', 'jewelhouse', 'jeweling', 'jewelless', 'jewellike', 'jewelry', 'jewelsmith', 'jewelweed', 'jewely', 'Jewess', 'jewfish', 'Jewhood', 'Jewish', 'Jewishly', 'Jewishness', 'Jewism', 'Jewless', 'Jewlike', 'Jewling', 'Jewry', 'Jewship', 'Jewstone', 'Jewy', 'jezail', 'Jezebel', 'Jezebelian'];

var buildSQL = function (title) {
  var sql = "SELECT * FROM paperbook.literatures WHERE title like '%" + title + "%'";
  return sql;
}

var test = function () {
  var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'paperbook'
  });
  connection.connect();
  var i = Math.round(Math.random() * 1000);
  var start = Date.now();
  var sql = buildSQL(titles[i]);
  connection.query(sql, null ,function (err, res) {
   if (err) {
    console.log(err);
    return;
   }
   var end = Date.now();
   console.log("running time is " + (end - start));
  });
  connection.end();
} ();

