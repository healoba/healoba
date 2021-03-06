"use strict";

let ObjectID = require('mongodb').ObjectID;
let path = require('path');
let rootPath = path.resolve(__dirname);

/**************************** Host ****************************/
let host = {};

host.domain = 'healoba.com';
host.shop = "http://shop.healoba.com";

exports.host = host;
/**************************** Web Site ****************************/
let site = {};

site.favicon = '/images/favicon.png';
site.logo = '/images/logo.png';
site.des = "هیلوبا، دانشنامه ی طب سنتی، اسلامی و علمی";
site.enc = {};
site.enc.des = "همه ی دانشنامه ها . هیلوبا";

exports.site = site;

/**************************** links / Server JS ****************************/
let links = {};

links.sign_out = "/sign/sign_out";
links.lanPopShow = "/stuff/lanPopShow";
links.telegram = "https://t.me/healoba";
exports.links = links;
/**************************** Pages / Server JS ****************************/
let pages = {};

pages.home = "/home";
pages.license = "/license";
pages.searchRes = "/searchRes";
pages.medicine = "/medicine/home";
pages.fruits = "/fruits/home";
pages.plants = "/plants/home";
pages.edible = "/edible/home";
pages.sickness = "/sickness/home";
pages.lifestyle = "/lifestyle/home";
pages.genetic = "/genetic/home";
pages.other = "/other/home";
pages.encyclopedia = {};
pages.encyclopedia.medicine = "/encyclopedia/medicine/";
pages.encyclopedia.fruits = "/encyclopedia/fruits/";
pages.encyclopedia.plants = "/encyclopedia/plants/";
pages.encyclopedia.edible = "/encyclopedia/edible/";
pages.encyclopedia.sickness = "/encyclopedia/sickness/";
pages.encyclopedia.lifestyle = "/encyclopedia/lifestyle/";
pages.encyclopedia.genetic = "/encyclopedia/genetic/";
pages.encyclopedia.other = "/encyclopedia/other/";
pages.signIn = "/signIn/#mainPart";
pages.signUp = "/signUp/#mainPart";
pages.panel = {};
pages.panel.home = "/panel/home";
pages.panel.EncTree = "/panel/EncTree";
pages.panel.encyclopedia = {};
pages.panel.encyclopedia.home = "/panel/encyclopedia";
pages.panel.encyclopedia.createArt = pages.panel.encyclopedia.home + '/createArt';
pages.panel.encyclopedia.placeArt = pages.panel.encyclopedia.home + '/placeArt';
pages.panel.encyclopedia.editArt = pages.panel.encyclopedia.home + '/editArt';
pages.panel.encyclopedia.updateArt = pages.panel.encyclopedia.home + '/updateArt';
pages.panel.encyclopedia.deleteArt = pages.panel.encyclopedia.home + '/deleteArt';
pages.panel.encyclopedia.approveArt = pages.panel.encyclopedia.home + '/approveArt';
pages.panel.encyclopedia.resources = pages.panel.encyclopedia.home + '/resources';
pages.panel.encyclopedia.delResource = pages.panel.encyclopedia.home + '/delResource';
pages.panel.encyclopedia.nodeInf = pages.panel.encyclopedia.home + '/nodeInf';
pages.panel.encyclopedia.nodeUrl = pages.panel.encyclopedia.home + '/nodeUrl';
pages.panel.encyclopedia.uploadFile = pages.panel.encyclopedia.home + '/uploadFile';
pages.panel.encyclopedia.ArtApproves = pages.panel.encyclopedia.home + '/ArtApproves';
pages.panel.encyclopedia.ArtResources = pages.panel.encyclopedia.home + '/ArtResources';
pages.panel.encyclopedia.URLNameValidation = pages.panel.encyclopedia.home + '/URLNameValidation';
pages.panel.pagesStuff = {};
pages.panel.pagesStuff.home = "/panel/pagesStuff";
pages.panel.pagesStuff.mainPage = pages.panel.pagesStuff.home + "/mainPage";
pages.panel.pagesStuff.slideShow = pages.panel.pagesStuff.home + "/slideShow";
pages.panel.pagesStuff.setSlideShow = pages.panel.pagesStuff.home + "/setSlideShow";
pages.panel.pagesStuff.getSlideShow = pages.panel.pagesStuff.home + "/getSlideShow";
pages.panel.translate = {};
pages.panel.translate.home = "/panel/translate";
pages.panel.translate.text = pages.panel.translate.home + "/text";
pages.panel.translate.art = pages.panel.translate.home + "/art";
pages.panel.adminStuff = {};
pages.panel.adminStuff.home = "/panel/adminStuff";
pages.panel.adminStuff.addResources = pages.panel.adminStuff.home + "/addResources";
pages.panel.adminStuff.editResources = pages.panel.adminStuff.home + "/editResources";
pages.panel.adminStuff.addEditResources = pages.panel.adminStuff.home + "/addEditResources";
pages.panel.adminStuff.resApproveArt = pages.panel.adminStuff.home + "/resApproveArt";
pages.panel.adminStuff.resTrusUsers = pages.panel.adminStuff.home + "/resTrusUsers";
pages.panel.adminStuff.resInf = pages.panel.adminStuff.home + "/resInf";
pages.panel.adminStuff.leg = pages.panel.adminStuff.home + "/leg";
pages.panel.adminStuff.nonArtTel = pages.panel.adminStuff.home + "/nonArtTel";
pages.panel.adminStuff.perm = pages.panel.adminStuff.home + "/perm";
pages.helper = {};
pages.helper.userRegion = '/helper/user_region';
pages.online_services = {};
pages.online_services.home = "/online_services/home";
pages.online_services.temperament = '/online_services/temperament';
pages.notTranslated = '/stuff/notTranslated';
pages.notTranslatedHtml = rootPath + '/site/stuff/notTranslated.html';

exports.pages = pages;
/**************************** Web Api ****************************/
let webApi = {};

pages.panel.adminStuff.nonArtsTelList_WA = pages.panel.adminStuff.home + "/WS/nonArtsTelList_WA";
pages.panel.adminStuff.nonArtTelAdd_WA = pages.panel.adminStuff.home + "/WS/nonArtTelAdd_WA";
pages.panel.adminStuff.nonArtTelDel_WA = pages.panel.adminStuff.home + "/WS/nonArtTelDel_WA";
pages.panel.adminStuff.permList_WA = pages.panel.adminStuff.home + "/WS/permList_WA";
pages.panel.adminStuff.delUser_WA = pages.panel.adminStuff.home + "/WS/delUser_WA";

exports.webApi = webApi;
/**************************** Layouts ****************************/
let layouts = {};

layouts.head = rootPath + '/site/layouts/head.ejs';
layouts.header = rootPath + '/site/layouts/header.ejs';
layouts.navbar = rootPath + '/site/layouts/navbar.ejs';
layouts.sidebar_navbar = rootPath + '/site/layouts/sidebar_navbar.ejs';
layouts.footer = rootPath + '/site/layouts/footer.ejs';
layouts.scripts = rootPath + '/site/layouts/scripts.ejs';
layouts.script = rootPath + '/site/layouts/script.ejs';
layouts.panel = {};
layouts.panel.navbar = rootPath + '/site/layouts/pages/panel/navbar.ejs';
layouts.panel.sidebar = rootPath + '/site/layouts/pages/panel/sidebar.ejs';
layouts.panel.CEArtFrom = rootPath + '/site/layouts/pages/panel/CreEditArtForm.ejs';
layouts.panel.addEditResForm = rootPath + '/site/layouts/pages/panel/addEditResForm.ejs';
layouts.panel.placeArtForm = rootPath + '/site/layouts/pages/panel/placeArtForm.ejs';
layouts.panel.chooseNodeTree = rootPath + '/site/layouts/pages/panel/chooseNodeTree.ejs';
layouts.panel.slideShowForm = rootPath + '/site/layouts/pages/panel/slideShowForm.ejs';
layouts.enc = {};
layouts.enc.sidebar = rootPath + '/site/layouts/pages/encyclopedia/sidebar.ejs';
layouts.os = {};
layouts.os.temperament = {};
layouts.os.temperament.sidebar = rootPath + '/site/layouts/pages/online_services/temperament/sidebar.ejs';
layouts.slideshow = rootPath + '/site/layouts/elements/slideshow.ejs';
layouts.article = rootPath + '/site/layouts/elements/article.ejs';
layouts.collapsibleQuestion = rootPath + '/site/layouts/elements/collapsibleQuestion.ejs';
layouts.approveRate = rootPath + '/site/layouts/elements/approveRate.ejs';
layouts.resources = rootPath + '/site/layouts/elements/resources.ejs';
layouts.artTags = rootPath + '/site/layouts/elements/artTags.ejs';
layouts.artLicense = rootPath + '/site/layouts/elements/artLicense.ejs';
layouts.allResources = rootPath + '/site/layouts/elements/allResources.ejs';
layouts.locationbar = rootPath + '/site/layouts/elements/location_bar.ejs';
layouts.mmodal = rootPath + '/site/layouts/elements/mmodal.ejs';
layouts.questionMark = rootPath + '/site/layouts/elements/questionMark.ejs';
layouts.telegram = rootPath + '/site/layouts/elements/telegram.ejs';
layouts.temperament = rootPath + '/site/layouts/elements/temperament.ejs';
layouts.enterEnc = rootPath + '/site/layouts/elements/enterEnc.ejs';
layouts.nodeJsObToClientJsOb = rootPath + '/site/layouts/helper/nodeJsObToClientJsOb.ejs';
layouts.ad = rootPath + "/site/layouts/elements/ad.ejs";

exports.layouts = layouts;
/**************************** Client CSS ****************************/
let css = {};

css.main = '/stylesheet/css/main/theme.css';
css.beautifier = '/stylesheet/css/main/beautifier.css';
css.bootstrap = '/framework/bootstrap-4.0.0-beta-dist/css/bootstrap.min.css';
css.circliful = '/framework/jquery-circliful/jquery.circliful.css';
css.font = '/stylesheet/css/main/font.css';
css.fontAwesome = '/framework/font-awesome/css/font-awesome.min.css';
css.animate = '/framework/animateCss/animate.min.css';
css.customBS = '/stylesheet/css/main/customBS.css';
css.fa = '/stylesheet/css/main/fa.css';
css.en = '/stylesheet/css/main/en.css';
css.os = {};
css.os.temperament = '/stylesheet/css/pages/online_services/temperament.css';
css.enc = {};
css.enc.home = '/stylesheet/css/pages/encyclopedia/home.css';
css.enc.main = '/stylesheet/css/pages/encyclopedia/theme.css';
css.enc.sidebar = '/stylesheet/css/pages/encyclopedia/sidebar.css';
css.panel = {};
css.panel.main = '/stylesheet/css/pages/panel/theme.css';
css.panel.sidebar = '/stylesheet/css/pages/panel/sidebar.css';
css.panel.EncTree = '/stylesheet/css/pages/panel/EncTree.css';
css.sign = '/stylesheet/css/pages/sign.css';
css.tinymce = '/stylesheet/css/elements/tinymce.css';
css.resources = '/stylesheet/css/elements/resources.css';
css.tagInput = '/framework/jQuery-Tags-Input/dist/jquery.tagsinput.min.css';
css.tagInputCustom = '/stylesheet/css/elements/tagInput.css';
css.slideshow = '/stylesheet/css/elements/slideshow.css';
css.tag = '/stylesheet/css/elements/tag.css';
css.toggleBotton = '/stylesheet/css/elements/toggleBotton.css';
css.article = '/stylesheet/css/elements/article.css';
css.approveRate = '/stylesheet/css/elements/approveRate.css';
css.artTags = '/stylesheet/css/elements/artTags.css';
css.mmodal = '/stylesheet/css/elements/mmodal.css';
css.boxes = '/stylesheet/css/elements/boxes.css';
css.questionmark = '/stylesheet/css/elements/questionMark.css';
css.gcs = '/stylesheet/css/elements/google_custom_search.css';
css.things = '/stylesheet/css/main/things.css';

exports.css = css;
/**************************** Client JS ****************************/
let js = {};

js.main = '/js/JS/main/main.js';
js.sign = '/js/JS/pages/sign.js';
js.encyclopedia = {};
js.os = {};
js.os.temperament = '/js/JS/pages/online_services/temperament.js';
js.encyclopedia.sidebar = '/js/JS/pages/encyclopedia/sidebar.js';
js.panel = {};
js.panel.main = '/js/JS/pages/panel/panel.js';
js.panel.sidebar = '/js/JS/pages/panel/sidebar.js';
js.panel.EncTree = '/js/JS/pages/panel/EncTree.js';
js.panel.chooseNodeTree = '/js/JS/pages/panel/chooseNodeTree.js';
js.panel.encyclopedia = {};
js.panel.encyclopedia.main = '/js/JS/pages/panel/encyclopedia/main.js';
js.panel.encyclopedia.editArt = '/js/JS/pages/panel/encyclopedia/editArt.js';
js.panel.encyclopedia.createArt = '/js/JS/pages/panel/encyclopedia/createArt.js';
js.panel.encyclopedia.placeArt = '/js/JS/pages/panel/encyclopedia/placeArt.js';
js.panel.encyclopedia.approveArt = '/js/JS/pages/panel/encyclopedia/approveArt.js';
js.panel.encyclopedia.resources = '/js/JS/pages/panel/encyclopedia/resources.js';
js.panel.encyclopedia.CreEditArtForm = '/js/JS/pages/panel/encyclopedia/CreEditArtForm.js';
js.panel.pagesStuff = {};
js.panel.pagesStuff.main = '/js/JS/pages/panel/pagesStuff/main.js';
js.panel.pagesStuff.mainPage = '/js/JS/pages/panel/pagesStuff/mainPage.js';
js.panel.pagesStuff.slideShow = '/js/JS/pages/panel/pagesStuff/slideShow.js';
js.panel.pagesStuff.slideShowFrom = '/js/JS/pages/panel/pagesStuff/slideShowFrom.js';
js.panel.adminStuff = {};
js.panel.adminStuff.main = '/js/JS/pages/panel/adminStuff/main.js';
js.panel.adminStuff.addEditResForm = '/js/JS/pages/panel/adminStuff/addEditResForm.js';
js.panel.adminStuff.addResources = '/js/JS/pages/panel/adminStuff/addResources.js';
js.panel.adminStuff.editResources = '/js/JS/pages/panel/adminStuff/editResources.js';
js.panel.adminStuff.resApproveArt = '/js/JS/pages/panel/adminStuff/resApproveArt.js';
js.panel.adminStuff.resTrusUsers = '/js/JS/pages/panel/adminStuff/resTrusUsers.js';
js.panel.adminStuff.leg = '/js/JS/pages/panel/adminStuff/leg.js';
js.panel.adminStuff.nonArtTel = '/js/JS/pages/panel/adminStuff/nonArtTel.js';
js.panel.adminStuff.perm = '/js/JS/pages/panel/adminStuff/perm.js';
js.jquery = '/framework/jquery-3.1.1.min.js';
js.bootstrap = '/framework/bootstrap-4.0.0-beta-dist/js/bootstrap.min.js';
js.popper = '/framework/popper/popper.min.js';
js.jshashes = '/framework/hashes.min.js';
js.tinymce = '/framework/tinymce/js/tinymce/tinymce.min.js';
js.tinymceJquery = '/framework/tinymce/js/tinymce/jquery.tinymce.min.js';
js.piwik = '/framework/piwik/piwik.js';
js.chartjs = '/framework/chartjs/Chart.bundle.min.js';
js.framework = {};
js.framework.circliful = '/framework/jquery-circliful/jquery.circliful.js';
js.tinymceInit = '/js/JS/elements/tinymceInit.js';
js.tagInput = '/framework/jQuery-Tags-Input/dist/jquery.tagsinput.min.js';
js.tagInputCustom = '/js/JS/elements/tagInput.js';
js.timeAgo = '/framework/jquery-timeago-master/jquery.timeago.js';
js.timeAgoFa = '/framework/jquery-timeago-master/locale/jquery.timeago.fa.js';
js.slideshow = '/js/JS/elements/slideshow.js';
js.search = '/js/JS/elements/search.js';
js.mmodal = '/js/JS/elements/mmodal.js';
js.langPop = '/js/JS/elements/langPop.js';
js.popover = '/js/JS/elements/popover.js';

exports.js = js;
/**************************** Methods ****************************/
let methods = {};

methods.db = {};
methods.db.main = rootPath + '/methods/DBMain.js';
methods.db.articles = rootPath + '/methods/DBArticles.js';
methods.db.relatedP = rootPath + '/methods/DBRelatedP.js';
methods.middlewares = rootPath + '/methods/middlewares.js';
methods.space = rootPath + '/methods/space.js';
methods.helper = rootPath + '/methods/helper.js';
methods.fix_or_maintain = rootPath + '/ProjectStuffs/fix_or_maintain.js';

exports.methods = methods;
/**************************** Space ****************************/
let space = {};

space.relPath = './space/';
space.articlesFolderName = 'articles/';
space.resourcesFolderName = 'resources/';
space.siteFolderName = 'site/';
space.slideshowFolderName = 'slideshow/';
space.onlineServicesFolderName = 'online_services/';

exports.space = space;
/**************************** Database ****************************/
let database = {};

database.enc = {};
database.enc.EncsColls = ['encyclopedia_medicine', 'encyclopedia_fruits',
'encyclopedia_plants', 'encyclopedia_edible', 'encyclopedia_sickness',
'encyclopedia_lifestyle', 'encyclopedia_genetic', 'encyclopedia_other'];
database.enc.allEncsColls = database.enc.EncsColls.concat('draft');
database.allColls = database.enc.allEncsColls.concat('users','telegram');
database.enc.medicine = {};
database.enc.medicine.rootObjId = new ObjectID ("587e4bc26e4949483846ec50");
database.enc.medicine.CollName = "encyclopedia_medicine";
database.enc.fruits = {};
database.enc.fruits.rootObjId = new ObjectID ("287e4bc11e4949483846ec50");
database.enc.fruits.CollName = "encyclopedia_fruits";
database.enc.plants = {};
database.enc.plants.rootObjId = new ObjectID ("287e4bc11e4949383846ec50");
database.enc.plants.CollName = "encyclopedia_plants";
database.enc.edible = {};
database.enc.edible.rootObjId = new ObjectID ("287e4bc11e4949383833ec50");
database.enc.edible.CollName = "encyclopedia_edible";
database.enc.sickness = {};
database.enc.sickness.rootObjId = new ObjectID ("397e4bc11e4966383833ec50");
database.enc.sickness.CollName = "encyclopedia_sickness";
database.enc.lifestyle = {};
database.enc.lifestyle.rootObjId = new ObjectID ("287e4bc11e4966383833ec50");
database.enc.lifestyle.CollName = "encyclopedia_lifestyle";
database.enc.genetic = {};
database.enc.genetic.rootObjId = new ObjectID ("397e4bc11e4956383833ec50");
database.enc.genetic.CollName = "encyclopedia_genetic";
database.enc.other = {};
database.enc.other.rootObjId = new ObjectID ("397e4bc11e5051383873ec50");
database.enc.other.CollName = "encyclopedia_other";
database.draft = {};
database.draft.CollName = 'draft';
database.site = {};
database.site.CollName = 'site';
database.telegram = {};
database.telegram.CollName = 'telegram';

exports.database = database;
/**************************** Codes ****************************/
let codes = {};

codes.notAllowed = -5;
codes.db = {};
codes.db.Error = -2;
codes.db.docNotFound = -3;
codes.db.docFound = 2;
codes.db.success = true;
codes.space = {};
codes.space.error = -1;
codes.space.success = 11;
codes.validationError = -4;
codes.lackOfInformation = -6;
codes.general = {};
codes.general.error = -10;

exports.codes = codes;