'use strict';


const color = require('../config/color');
let demFeels = function () {};
demFeels.getEmotes = function () {
	return {};
};
try {
	demFeels = require('dem-feels');
} catch (e) {
	console.error(e);
}

exports.parseEmoticons = parseEmoticons;

// for travis build
if (typeof demFeels.extendEmotes === 'function') {
	// example extending emotes
	demFeels.extendEmotes({
		'feelshiver' : 'https://i.imgur.com/OUdKETM.gif',
		'feelspute':'http://puu.sh/tlVlA/94b278251b.jpg',
		'feelslsd':'http://i0.kym-cdn.com/photos/images/original/000/105/986/130014911356.gif',
		'feelsmaki':'http://image.prntscr.com/image/ad2511dd39e644f89c582653a1e21414.png',
		'feelskawaii':'https://s-media-cache-ak0.pinimg.com/originals/1c/fb/d0/1cfbd086d1b9cd45f3de21e6c42ee1e5.gif',
		'feelsbarbi':'http://www.pokepedia.fr/images/thumb/0/02/Barbicha-RS.png/250px-Barbicha-RS.png',
		'feelsramo':'http://image.jeuxvideo.com/medias-sm/148068/1480682838-233-artwork.png',
		'feelsmog':'http://orig03.deviantart.net/9d5f/f/2016/363/d/8/cosmog_licky_by_animela_wolfhybrid-datdnqk.gif',
		'feelszok':'https://image.jeuxvideo.com/medias-sm/148068/1480682452-3658-artwork.png',
		'oshet':'http://i.imgur.com/yr5DjuZ.png',
		'feelsrg':'https://cdn.rawgit.com/CreaturePhil/dem-feels/master/emotes/feelsrg.png',
		'feelszokuru':'http://puu.sh/tlVGF/9e762b38ca.jpg',
		'feelsfleur':'https://illiweb.com/fa/i/smiles/icon_flower.png',
		'feelsupra':'http://data.whicdn.com/images/179018121/large.jpg',
		'feelspink':'https://cdn.rawgit.com/CreaturePhil/dem-feels/master/emotes/feelspink.png',
		'feelsaiyan':'http://vignette1.wikia.nocookie.net/official-pepe/images/4/4d/Gokupepe.jpg',
		'feelsrekt':'http://i.imgur.com/aNJyMr7.gif',
		'feelslag':'https://cdn.betterttv.net/emote/56758c29bf317838643c7e97/2x',
		'feelsohwait':'https://cdn.betterttv.net/emote/55ab96ce9406e5482db53424/2x',
		'feelsvomi':'http://i.imgur.com/nQbRspU.png?1',
		'feelshrk':'http://i.imgur.com/amTG3jF.jpg',
		'feelsfu':'http://i.imgur.com/SExGz2b.jpg',
		'feelstrump2':'http://i.imgur.com/tqW8s6Y.png',
		'feelsya':'https://cdn.betterttv.net/emote/5678a310bf317838643c8188/2x',
		'lamacool':'http://i.imgur.com/X1x3728.gif',
		'lamanoodles':'http://i.imgur.com/SUZkz5p.gif',
		'lamapeur':'http://i.imgur.com/9PgUk4M.gif',
		'lamasympa':'http://i.imgur.com/KWAQbPu.gif',
		'lamatea':'http://i.imgur.com/nJnakEU.gif',
		'lamayawn':'http://i.imgur.com/SVj8kBt.gif',
		'lamacry':'http://i.imgur.com/ID6i8rl.gif',
		'lamagrumpy':'http://i.imgur.com/0wd2uVv.gif',
		'lamakawaii':'http://i.imgur.com/vpwn7ky.gif',
		'lamacute':'http://i.imgur.com/5hi0kjz.gif',
		'lamacul':'http://i.imgur.com/LqgeVh4.gif',
		'lamasick':'http://i.imgur.com/5KrKnSV.gif',
		'lamafacepalm':'http://i.imgur.com/cjzeuYJ.gif',
		'lamabella':'http://i.imgur.com/A5W2njQ.gif',
		'feelsgj':'http://i.imgur.com/DU3igIk.png',
		'catfight':'http://i.imgur.com/4KHaEgD.gif',
		'feelswag':'http://i.imgur.com/Avme6Ii.jpg',
		'guzmalol':'http://i.imgur.com/vdw4jhL.gif',
		'justright':'http://i.imgur.com/92nRB1S.png',
		'guzmadab':'http://i.imgur.com/MoujRZ8.png',
		'feelsporto':'https://img.fireden.net/v/image/1459/17/1459179996701.jpg',
		'feelsgay':'http://i.imgur.com/zQAacwu.png?1',
		'feelsrs':'http://i.imgur.com/qGEot0R.png',
		'feelsREKT':'http://i.imgur.com/aNJyMr7.gif',
		':haha:':'http://i.imgur.com/R2g0RHT.gif',
		'feelskill':'http://www.sherv.net/cm/emoticons/fighting/stabbing.gif',
		'horrorpuff':'http://i.imgur.com/eh0cdj0.gif',
		'feelsexe':'https://www.yellowbox.com.sg/image/cache/data/products/Black%20Trash%20Bag-400x400.jpg',
		'feelstaunt':'http://i.imgur.com/tGBhxDY.gif',
		':angry:':'http://i.imgur.com/5psxIbl.png',
		'lamapretty':'http://i.imgur.com/mBPcOQW.gif',
		'lamabored':'http://i.imgur.com/BN5GWyh.gif',
		'lamawhat':'http://i.imgur.com/KdH5d2T.gif',
		'lamaconfus':'http://i.imgur.com/UMKEMqT.gif',
		'lamaboufi':'http://i.imgur.com/b68b6Ve.gif',
		'lamableed':'http://i.imgur.com/MtJBiyY.gif',
		'lamanobody':'http://i.imgur.com/WVgP9Mz.gif',
		'lamahi':'http://i.imgur.com/2BeipQ8.gif',
		'feelsweird':'https://cdn.betterttv.net/emote/5603731ce5fc5eff1de93229/2x',
		'#freewolf': 'http://i.imgur.com/ybxWXiG.png',
		'dogeapproves': 'http://i.imgur.com/iX6q10m.png',
		'feelsnaruto': 'http://i.imgur.com/fhgK5pb.png',
		'feelspoli':'http://i.imgur.com/FnzhrWa.jpg?1',
		'feelsexy': 'https://cdn.betterttv.net/emote/56396c857e538de14bd747a5/2x',
		'feelsbdoge':'http://i.imgur.com/N940pnA.png',
		'feelscute':'http://i.skyrock.net/9664/59399664/pics/2465538933_1.gif',
		'feelsrage':'http://i.imgur.com/O7siCMA.gif',
        'feelspeks':'http://inspiresara.com/wp-content/uploads/2015/04/Peanut-butter-jelly-time.gif',
        'feelsghost':'http://66.media.tumblr.com/720e98367dd0e798df50c666b8a82d67/tumblr_nwgd1gAUTH1undzuio1_1280.gif',
        'feelsjesus':'http://imgur.com/Gid6Zjy.png',
        'feelspika':'http://i.imgur.com/mBq3BAW.png',
	'poubheil':'http://i.imgur.com/rghiV9b.png',
	':pouce:': 'http://i.imgur.com/FB78VjU.jpg',
	':darkrai:':'http://orig07.deviantart.net/fa6d/f/2011/255/e/b/darkrai_sprite_gif_by_infernonick-d49nizb.gif',
	'pepecasso':'http://i.imgur.com/OBIqaes.jpg',
	'feelsbreyn': 'http://i.imgur.com/dzgYjnX.jpg',
	'brindidi':'http://orig01.deviantart.net/85ad/f/2016/176/a/a/rowlet_sprite_animation_by_snivy101-da25pcg.gif',
	'bidounet':'http://orig14.deviantart.net/4143/f/2009/191/b/c/bc26524d23b3c55f02163f5f9cafda41.gif',
	'feelsvolc':'http://i.imgur.com/QXlKzZd.png?1',
	'feelserp':'http://i.imgur.com/PtCTxmY.png',
	'hypnotoad':'http://i.imgur.com/lJtbSfl.gif',
	'feelsdz':'https://pbs.twimg.com/media/CGenAbAWcAAQsO9.jpg',
	'feelsbulba':'http://i.imgur.com/PShsRD2.png',
	'feelshade':'http://i.imgur.com/Tuza6Y4.png',
	'fukya':'http://i.imgur.com/ampqCZi.gif',
	'feelsrq':'http://i.imgur.com/uIIBChH.png',
	'feelsitum': 'http://i.imgur.com/FnzhrWa.jpg?1',
	'feelswave':'http://i.imgur.com/VwCJqjD.gif',
	'feeljapan':'http://i.imgur.com/Zz2WrQf.jpg',
	'feelscreep':'http://i.imgur.com/zJp7oJL.gif',
	'feelsmew': 'http://rs1229.pbsrc.com/albums/ee475/Ditto926/My%20Sprites/Mew.gif~c100',
	'feelszardx':'http://i.imgur.com/ZsTZ6WD.gif',
	'feelsbui': 'http://a.deviantart.net/avatars/r/i/rijaya-vidra.gif?2',
	'feelsmilk':'http://orig00.deviantart.net/56b2/f/2010/353/0/0/miltank_licking_avatar_by_seigyuu-d356hud.gif',
	'feelstoge':'http://orig12.deviantart.net/baa4/f/2010/178/1/4/kissu_lick_by_joalsses.gif',
	'feelshydra':'http://orig10.deviantart.net/0124/f/2012/340/0/b/hydreigon_lick_icon_by_d12345t-d5n62ok.gif',
	'feelsdrud':'http://orig02.deviantart.net/a139/f/2012/223/6/d/druddigon_lick_icon_by_d12345t-d5aracp.gif',
	'feelsdoom':'http://orig03.deviantart.net/5e28/f/2010/178/3/5/request_hound_lick_by_joalsses.gif',
	'feelsjolt': 'http://i.imgur.com/3c5IXWh.gif',
	'feelstyph':'http://orig13.deviantart.net/50f8/f/2010/193/1/2/typhlosion_lick_icon_by_aquamightyena.gif',
	'feelsbird':'http://a.deviantart.net/avatars/z/a/zapdosrockz.gif',
	'feelspaul':'http://i.imgur.com/ZQbYp9l.gif',
	'feelsabsol':'http://orig10.deviantart.net/ab3e/f/2011/160/7/5/absol_lick_by_missdrawsalot-d3ii5pq.gif',
	'feelsgatr':'http://orig15.deviantart.net/4032/f/2010/229/0/b/_rq__feraligatr_lick_icon_by_fennekvee.gif',
	'feelspsy':'http://orig04.deviantart.net/b3f4/f/2010/119/8/8/psyduck_free_lick_avatar_by_yakalentos.gif',
	'feelsdialga':'http://orig10.deviantart.net/7f9c/f/2011/232/9/c/dialgalickicon___request_by_zekrom622-d479wzz.gif',
	'feelsarceus':'http://static.planetminecraft.com/files/avatar/112222_0.gif',
	'feelshiny': 'http://orig06.deviantart.net/b1da/f/2011/145/0/f/liepard_lick_icon_by_mushydog-d3h8rk7.gif',
	'feelsweav':'http://orig07.deviantart.net/620a/f/2010/220/1/8/_rq__weavile_lick_icon_by_fennekvee.gif',
	'feelslux':'http://i.imgur.com/hDKCZMt.gif',
	'feelsfloat': 'http://i.imgur.com/XKP1Kpf.gif',
	'feelstales':'http://a.deviantart.net/avatars/c/h/chaoni.gif',
	'feelsmeow':'http://orig14.deviantart.net/2a17/f/2010/136/8/5/free_meowth_icon_by_mookameedy.gif',
	'feelschar':'https://orig04.deviantart.net/9abc/f/2013/118/8/e/charizard_lick_icon_by_spritegirl999-d63d7sf.gif',
	'feelshay': 'http://orig04.deviantart.net/41ff/f/2010/108/0/2/skymin_free_lick_avatar_by_yakalentos.gif',
	'feelsvapo':'http://i.imgur.com/ODTZISl.gif',
	'feelsnyan':'http://i.imgur.com/sUZkR32.gif',
	'facepalm':'http://i.imgur.com/ylrqFwJ.png',
	'feelsvieujuif':'https://image.noelshack.com/fichiers/2019/13/1/1553536247-mfw-i-bought-vietnamese-quot-beats-quot-for-15-and-they-still-477fee5bb71b44c60c551addca1901df.png',
	'feelsnake':'http://i.imgur.com/xoJnDUD.png',
	'feelsteemo':'https://cdn.betterttv.net/emote/5603731ce5fc5eff1de93229/2x',
	'feelsexy':'https://cdn.betterttv.net/emote/56396c857e538de14bd747a5/2x',
	'feelsmerry':'https://cdn.betterttv.net/emote/5658e10f18d1dbe358624e35/2x',
	'feelsyawn':'http://orig00.deviantart.net/e710/f/2015/169/4/3/cat_yawn_by_iamverylucky-d8xsx9q.gif',
	'feelsjessy': 'http://data.whicdn.com/images/177317203/superthumb.jpg',
	'feelsfp':'http://40.media.tumblr.com/9327e4e13e781bef4b589bc877a2dae4/tumblr_inline_nogc7acE2f1saulf0_250.jpg',
	'feelsberry':'http://i.imgur.com/aCctYQo.gif',
	'feelsfeels': 'https://img.buzzfeed.com/buzzfeed-static/static/2015-10/27/17/enhanced/webdr07/longform-24536-1445980295-3.jpg',
	'feelsart': 'https://img.buzzfeed.com/buzzfeed-static/static/2015-10/27/17/enhanced/webdr11/enhanced-mid-29607-1445980104-1.jpg',
	'feelsmeme': 'https://b.thumbs.redditmedia.com/_ZIxbtkWetWvh5IzMhalUnJW4wzkrX-R6fyRcxmpefI.png',
	'feelskyrio': 'http://40.media.tumblr.com/26b83de0cbc3e94f09af832bd2b65dd2/tumblr_npbvu5zVA11uudk2uo1_250.jpg',
	'feelskek': 'http://www.cjoint.com/doc/16_02/FBzrVNeM7Db_kek.png',
	'feelsrekt': 'http://www.cjoint.com/doc/16_02/FBwmJgrFwF7_emotes-rekt.png',
	'feelscool': 'http://totoz.eu/img/sadfrog62%3A1',
	'#freewolf': 'http://i.imgur.com/ybxWXiG.png',
	'feelspoli': 'http://i.imgur.com/sbKhXZE.jpg?1',
	'feelsbd': 'http://i.imgur.com/YyEdmwX.png',
	'feelsbm': 'http://i.imgur.com/xwfJb2z.png',
	'tetevache':'http://image.noelshack.com/fichiers/2016/45/1478887128-teteecremeuhp.png',
	'feelsnerd': 'https://cdn.rawgit.com/CreaturePhil/dem-feels/master/emotes/feelsnerd.png',
	'feelsbn': 'http://i.imgur.com/wp51rIg.png',
	'feelsdd': 'http://i.imgur.com/fXtdLtV.png',
	'feelsdoge': 'http://i.imgur.com/GklYWvi.png',
	'feelscri':'http://i.imgur.com/QAuUW7u.jpg?1',
	'feelsprof':'https://cdn.betterttv.net/emote/55aeba450d87fd2766bee7cd/2x',
	'feelsgd': 'http://i.imgur.com/Jf0n4BL.png',
	'feelsgn': 'http://i.imgur.com/juJQh0J.png',
	'feelsrb':'https://cdn.rawgit.com/CreaturePhil/dem-feels/master/emotes/feelsrb.png',
	'feelshp': 'http://i.imgur.com/1W19BDG.png',
	'feelsomg':'https://cdn.rawgit.com/CreaturePhil/dem-feels/master/emotes/feelscr.png',
	'feelsmd': 'http://i.imgur.com/DJHMdSw.png',
	'feelsnv': 'http://i.imgur.com/XF6kIdJ.png',
	'feelsgame':'http://a.deviantart.net/avatars/f/l/flameheart10.gif?11',
	'feelsbebop':'http://i.imgur.com/TDwC3wL.png',
	'feelsok': 'http://i.imgur.com/gu3Osve.png',
	'feelsbreyn': 'https://cdn.betterttv.net/emote/5638163f55dee26813aebbf1/2x',
	'feelspaul':'http://i.imgur.com/Gv2BFxs.png',
	'feelsdiable':'http://i.imgur.com/zOemc0n.png',
	'feelscune':'http://orig00.deviantart.net/3981/f/2013/038/a/9/free_bouncy_suicune_icon_by_kattling-d5u4dym.gif',
	'feelsnoctali':'http://orig15.deviantart.net/bd77/f/2012/315/b/6/free_bouncy_umbreon_icon_by_kattling-d5koqlt.gif',
	'feelsaquali':'http://orig03.deviantart.net/fe3b/f/2012/315/5/e/free_bouncy_vaporeon_icon_by_kattling-d5k3udr.gif',
	'feelsevoli':'http://orig06.deviantart.net/378e/f/2012/305/2/1/free_bouncy_eevee_icon_by_kattling-d5jnjl3.gif',
	'feelspyroli':'http://orig12.deviantart.net/443b/f/2012/307/5/c/free_bouncy_flareon_icon_by_kattling-d5ju0kd.gif',
	'feelsgivrali':'http://orig06.deviantart.net/d9b2/f/2012/316/a/c/free_bouncy_glaceon_icon_by_kattling-d5kt02m.gif',
	'feelsvoltali':'http://orig03.deviantart.net/8e59/f/2012/308/a/f/free_bouncy_jolteon_icon_by_kattling-d5jypo8.gif',
	'feelsmentali':'http://orig03.deviantart.net/f925/f/2012/315/f/6/free_bouncy_espeon_icon_by_kattling-d5kmktt.gif',
	'feelsphyllali':'http://orig15.deviantart.net/90fb/f/2012/319/6/3/free_bouncy_leafeon_icon_by_kattling-d5l2fle.gif',
	'feelsnymphali':'http://orig05.deviantart.net/aa0a/f/2013/314/3/9/free_bouncy_sylveon_icon_by_kattling-d6tr6y7.gif',
	'feelspikachu':'http://orig15.deviantart.net/11b5/f/2012/303/c/7/free_bouncy_pikachu_icon_by_kattling-d5jgq5l.gif',
	'feelsobalie':'http://i.imgur.com/RIOKSJ3.gif',
	'feelsuno':'http://orig08.deviantart.net/0079/f/2013/003/8/f/free_bouncy_articuno_icon_by_kattling-d5q8y4z.gif',
	'feelsdos':'http://orig01.deviantart.net/d1df/f/2013/006/2/a/free_bouncy_zapdos_icon_by_kattling-d5qo7yc.gif',
	'feelstres':'http://orig01.deviantart.net/7861/f/2013/011/3/1/free_bouncy_moltres_icon_by_kattling-d5r5x9a.gif',
	'feelsmudkip':'http://orig07.deviantart.net/636c/f/2013/285/b/0/free_bouncy_mudkip_icon_by_kattling-d6q57fd.gif',
	'feelsemence':'http://orig13.deviantart.net/efe1/f/2013/308/a/1/free_bouncy_caterpie_icon_by_kattling-d6t0tp6.gif',
	'feelsgerm':'http://orig05.deviantart.net/2ad7/f/2014/325/9/0/free_bouncy_chikorita_icon_by_kattling-d875yp4.gif',
	'cafevsthe':'http://media.tumblr.com/68eb56721b0833c66c8a9542ed515594/tumblr_inline_mkj23fgNsZ1qz4rgp.gif',
	'brindiboum':'http://i.imgur.com/2QUS25j.gif',
	'Doge':'http://fc01.deviantart.net/fs71/f/2014/279/4/5/doge__by_honeybunny135-d81wk54.png',
	'feelspeks': 'http://i.imgur.com/YuPzcjd.gif',
	':kek:': 'http://image.noelshack.com/fichiers/2014/37/1410279891-rire.gif',
	':darkrai:': 'http://orig07.deviantart.net/fa6d/f/2011/255/e/b/darkrai_sprite_gif_by_infernonick-d49nizb.gif',
	'#distrib': 'http://51.38.238.97:8000/avatars/distrib.gif',
	':hollande:': 'http://institutdeslibertes.org/wp-content/uploads/2015/09/french-president-francois-hollande-might-give-up.jpg',
	'memeredmaxx': 'http://i.imgur.com/k9YCF6K.png',
	'feelsdc': 'http://i3.kym-cdn.com/photos/images/original/000/968/807/1be.gif',
	'feelsissou': 'https://media.tenor.co/images/d017d7e4bc7cead644ba825a40c7c614/tenor.gif',
	'#hendeks': 'http://i.imgur.com/5Lo0iRq.jpg',
	'feelstouffe': 'https://49.media.tumblr.com/80db5cd66d141b82f894e4538fb138b6/tumblr_mt5eap7Wfq1qd87hlo1_500.gif',
	':pascon:': 'http://i.imgur.com/HvBkiCe.png?1',
	'AH': 'https://image.noelshack.com/fichiers/2017/29/3/1500483515-bloggif-596f8fa92bf45.jpeg',
	':non:': 'https://image.noelshack.com/fichiers/2017/29/5/1500638591-bloggif-5971ed5e27229.jpeg',
	'feelsautiste': 'https://media.tenor.com/images/ea7dc51370cfcc5351f723b18f51cc3e/tenor.gif', 
	':keur:': 'http://pa1.narvii.com/6337/67f00579d9eeee741778dfe096dc6983c7dfc8cb_hq.gif',
	':osef:': 'https://image.noelshack.com/fichiers/2017/34/2/1503399406-bloggif-5999bebe3f40c.jpeg',
	'feelstylton': 'https://image.noelshack.com/fichiers/2017/34/2/1503399399-bloggif-5999ba3a02f43.gif', 
	'feelscalin': 'https://image.noelshack.com/fichiers/2017/34/2/1503399406-bloggif-5999bc0b9aee8.gif',
	'feelsmimi': 'https://orig13.deviantart.net/fb41/f/2016/207/6/8/mimikyu_lick_icon_by_youcantstopmesinning-dabirp2.gif',
	'feelsmotis': 'https://orig08.deviantart.net/323e/f/2011/279/e/6/rotom_licky_by_veedoo500-d4c0smw.gif',
	':empo:': 'https://pldh.net/media/pokemon/shuffle/395.png',
	':malou:': 'https://lh6.ggpht.com/E2M4FpFaTdols-bHxd8E8AI1q6Y6_JsQ9vBj67YqnyC0stWJK4sBXmuWXfmvRNh9hXQ=w300',
	'dewgong': 'http://rs1196.pbsrc.com/albums/aa414/MysteriiGhost/Pokemon%20OC/087.gif~c200',
	':wow:': 'http://i2.kym-cdn.com/photos/images/newsfeed/000/270/623/337.gif',
	'feelspoop': 'https://thepandanerd.files.wordpress.com/2015/09/tumblr_mn4yqwc1i91srkw8zo1_400.png',
	':OKE:': 'http://i0.kym-cdn.com/entries/icons/facebook/000/019/649/OK_thumb.jpg',
	':rip:': 'https://image.noelshack.com/fichiers/2017/35/3/1504078281-rip.png',
	':clap:': 'https://i.giphy.com/media/7rj2ZgttvgomY/giphy.webp',
	'fdpoulpe': 'https://i.giphy.com/media/PxdWYostrUcz6/giphy.webp',
	'feelsmolang': 'http://pa1.narvii.com/6450/624b618ab94f8f3755f4e0425d26c81c45194977_hq.gif',
	':kawaii:': 'https://i.imgur.com/zmuU0a2.gif',
	'#luffy': 'https://image.noelshack.com/fichiers/2017/36/2/1504635719-source.gif',
	'#alex': 'http://51.38.238.97:8000/avatars/0footprof.png',
	'catdance': 'http://petit.chat/wp-content/uploads/2015/12/gif.petit_.chat_.fun-46.gif',
	'feelspat': 'https://image.noelshack.com/fichiers/2017/38/3/1505937431-5dlzy09.gif',
	':ok:': 'http://i0.kym-cdn.com/photos/images/facebook/000/959/929/b80.png',
	'fliptable': 'https://image.noelshack.com/fichiers/2017/39/1/1506357194-fliptable.gif',
	'feelscheh': 'https://i.giphy.com/media/4QxQgWZHbeYwM/giphy.gif',
	'feelskiss': 'https://media.tenor.com/images/e0b46d664eecc78b09bfe36ccc7b1a04/tenor.gif',
	'CharjaBG': 'https://cdn.bulbagarden.net/upload/e/ec/737Charjabug.png',
	'feelsleep': 'https://camo.derpicdn.net/d90eb8b632609db6fe8dabac54ae84fd2927b8eb?url=http%3A%2F%2F38.media.tumblr.com%2F768637ccbcc4781676ae957e7e15babe%2Ftumblr_inline_nu2takmSRG1t87xnn_500.gif',
	':baka:': 'http://cdn-9chat-fun.9cache.com/media/photo/aoE9BMZno_480w_v1.jpg',
	'feelslens': 'http://51.38.238.97:8000/avatars/nuffy2003.png',
	'feelsboude': 'https://i.giphy.com/media/dz0HTNJUfQfYI/giphy.webp',
	'dogedc': 'https://i.imgur.com/JTEU1dx.gif',
	'feelseh': 'http://images5.fanpop.com/image/answers/323000/323949_1322804271202_400_250.jpg',
	'lamabad': 'https://i.imgur.com/M4qpLQd.gif',
	'#kirby': 'https://vignette.wikia.nocookie.net/vsbattles/images/e/e0/KSA_Kirby_Artwork.png/revision/latest?cb=20180125060205',
	'feelsdC': 'http://i.imgur.com/A7oAjdY.png',
	'lamahide': 'https://i.imgur.com/RLwIDjZ.gif',
	':dcd:': 'https://media.discordapp.net/attachments/311595748175380481/387280986032832512/rip.png',
	':pompom:': 'https://78.media.tumblr.com/e3735a601dfbd482f7d3067d971259cd/tumblr_ob8gfaq78y1v68t0mo4_500.gif',
	':serieux:': 'https://image.noelshack.com/fichiers/2017/51/3/1513799533-bloggif-5a3abf45bfc56.gif',
	'feelsjeanclaude': 'http://image.noelshack.com/fichiers/2018/04/6/1517087778-screenshot-50.png',
	':coucou:': 'http://image.noelshack.com/fichiers/2018/08/5/1519421670-bloggif-5a9054028195e.gif',
	'lamasmug': 'https://orig08.deviantart.net/7250/f/2013/347/f/5/llama_emoji_45__smug___v2__by_jerikuto-d6uwuvh.gif',
	'#taranza': 'https://78.media.tumblr.com/97c7e90ab6bf229ffe00ee714f12c962/tumblr_orf003sJRO1rpzuw0o1_500.png',
	'#magolor': 'https://img00.deviantart.net/1e3b/i/2012/278/d/e/sticker_magolor_by_riodile-d5gu7sp.png',
	'feelskevin': 'http://image.noelshack.com/fichiers/2018/13/6/1522528023-94f54c7e454e8574ea885d97c93c1622acf24ed84b46351088-pimgpsh-thumbnail-win-distr.jpg',
	':messi:': 'https://cdn.discordapp.com/emojis/464470584231723009.png?v=1',
	':triggered:': 'https://image.noelshack.com/fichiers/2018/30/6/1532787295-bloggif-5b5633650149e.png',
	'feelsouaf': 'https://cdn.discordapp.com/attachments/434757343943589888/474555786304159744/tenor-1.gif',
	'#gaspar': 'https://i.imgur.com/6EB30Jt.png',
	'#selfie': 'http://image.noelshack.com/fichiers/2018/35/6/1535796969-gsapar-balta.png',
	':tympole:': 'https://cdn.discordapp.com/emojis/480106340950343701.png?v=1',
	'#jcprod': 'https://cdn.discordapp.com/attachments/484809954591506433/485550889537503262/LOGO_J.C_PRODUCTIONS.png',
	':fillon:': 'https://cdn.discordapp.com/emojis/447426553622822922.png?v=1',
	':crying:': 'https://cdn.discordapp.com/emojis/483733722667941946.png?v=1',
	':issouka:':'https://risibank.fr/cache/stickers/d578/57867-full.png',
	':yeaok:' : 'https://cdn.discordapp.com/emojis/338908474027016194.png?v=1',
		':sueur:' : 'http://image.noelshack.com/fichiers/2017/30/4/1501186885-risitasueurbestreup.png',
	':ANGERY:' : 'https://cdn.discordapp.com/emojis/395628368596434945.png?v=1',
	':thenkeng:' : 'https://cdn.discordapp.com/emojis/481391176818360321.png?v=1',
	':thinking' : 'https://discordapp.com/assets/53ef346458017da2062aca5c7955946b.svg',
	'#UWR' : 'http://image.noelshack.com/fichiers/2018/44/3/1541019720-rose-quartz-by-sbrixynya-dawafu3.gif',
	':wailord:' : 'http://image.noelshack.com/fichiers/2018/44/3/1541019805-tinyfloatingwhale.gif',
	':onion:' : 'http://image.noelshack.com/fichiers/2018/44/3/1541019812-d91.gif',
	'#000s' : 'https://i.imgur.com/kJppajQ.jpg',
		'feelshmm' : 'https://i.imgur.com/zMKFtnB.gif',
		'feelshiver' : 'https://i.imgur.com/OUdKETM.gif',
		':perfect:' : 'https://image.noelshack.com/fichiers/2019/15/6/1555184181-d-convertimage-convertimage.jpg',
	});
}

const emotes = demFeels.getEmotes();

const emotesKeys = Object.keys(emotes).sort();


/**
* Parse emoticons in message.
*
* @param {String} message
* @param {Object} room
* @param {Object} user
* @param {Boolean} pm - returns a string if it is in private messages
* @returns {Boolean|String}
*/
function parseEmoticons(message, room, user, pm) {
	if (typeof message !== 'string' || (!pm && room.disableEmoticons)) return false;

	let match = false;
	let len = emotesKeys.length;

	while (len--) {
		if (message && message.indexOf(emotesKeys[len]) >= 0) {
			match = true;
			break;
		}
	}

	if (!match) return false;

	// escape HTML
	message = Chat.escapeHTML(message);

	// add emotes
	message = demFeels(message);

	// __italics__
	message = message.replace(/\_\_([^< ](?:[^<]*?[^< ])?)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>');

	// **bold**
	message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>');

	let group = user.getIdentity().charAt(0);
	if (room && room.auth) group = room.auth[user.userid] || group;
	if (pm && !user.hiding) group = user.group;

	if (pm) return "<div class='chat' style='display:inline'>" + "<em class='mine'>" + message + "</em></div>";

	let style = "background:none;border:0;padding:0 5px 0 0;font-family:Verdana,Helvetica,Arial,sans-serif;font-size:9pt;cursor:pointer";
	message = "<div class='chat'>" + "<small>" + group + "</small>" + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>" + "<b><font color='" + color(user.userid) + "'>" + user.name + ":</font></b>" + "</button><em class='mine'>" + message + "</em></div>";

	room.addRaw(message);

	room.update();

	return true;
}

/**
* Create a two column table listing emoticons.
*
* @return {String} emotes table
*/
function create_table() {
	let emotes_name = Object.keys(emotes);
	let emotes_list = [];
	let emotes_group_list = [];
	let len = emotes_name.length;

	for (let i = 0; i < len; i++) {
		emotes_list.push("<td style='padding: 5px; font-size: 11px;box-shadow:0px 0px 2px 2px rgba(0, 0, 0, 0.15) inset; border-radius: 5px;'>" + "<img src='" + emotes[emotes_name[i]] + "'' title='" + emotes_name[i] + "' height='30' width='30' style='vertical-align: middle;  padding-right: 5px;' />" + emotes_name[i] + "</td>");
	}

	for (let i = 0; i < len; i += 5) {
		let emoteOutput = [emotes_list[i], emotes_list[i + 1], emotes_list[i + 2], emotes_list[i + 3], emotes_list[i + 4]];
		if (i < len) emotes_group_list.push("<tr>" + emoteOutput.join('') + "</tr>");
	}

	return (
		"<div class='infobox'>" +
		"<details><summary><strong>Emotes</strong></summary><div style='max-height: 300px; overflow-y: scroll; padding:0px'><table style='background: rgba(245, 245, 245, 0.05);padding: 0px;' width='100%'>" +
		emotes_group_list.join("") +
		"</table></details></div></div>"
	);
}

let emotes_table = create_table();

exports.commands = {
	blockemote: 'blockemoticons',
	blockemotes: 'blockemoticons',
	blockemoticon: 'blockemoticons',
	blockemoticons: function (target, room, user) {
		if (user.blockEmoticons === (target || true)) return this.sendReply("You are already blocking emoticons in private messages! To unblock, use /unblockemoticons");
		user.blockEmoticons = true;
		return this.sendReply("You are now blocking emoticons in private messages.");
	},
	blockemoticonshelp: ["/blockemoticons - Blocks emoticons in private messages. Unblock them with /unblockemoticons."],

	unblockemote: 'unblockemoticons',
	unblockemotes: 'unblockemoticons',
	unblockemoticon: 'unblockemoticons',
	unblockemoticons: function (target, room, user) {
		if (!user.blockEmoticons) return this.sendReply("You are not blocking emoticons in private messages! To block, use /blockemoticons");
		user.blockEmoticons = false;
		return this.sendReply("You are no longer blocking emoticons in private messages.");
	},
	unblockemoticonshelp: ["/unblockemoticons - Unblocks emoticons in private messages. Block them with /blockemoticons."],

	emotes: 'emoticons',
	emoticons: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReply("|raw|" + emotes_table);
	},
	emoticonshelp: ["/emoticons - Get a list of emoticons."],

	toggleemote: 'toggleemoticons',
	toggleemotes: 'toggleemoticons',
	toggleemoticons: function (target, room, user) {
		if (!this.can('declare', null, room)) return false;
		room.disableEmoticons = !room.disableEmoticons;
		this.sendReply("Disallowing emoticons is set to " + room.disableEmoticons + " in this room.");
		if (room.disableEmoticons) {
			this.add("|raw|<div class=\"broadcast-red\"><b>Emoticons are disabled!</b><br />Emoticons will not work.</div>");
		} else {
			this.add("|raw|<div class=\"broadcast-blue\"><b>Emoticons are enabled!</b><br />Emoticons will work now.</div>");
		}
	},
	toggleemoticonshelp: ["/toggleemoticons - Toggle emoticons on or off."],

};
