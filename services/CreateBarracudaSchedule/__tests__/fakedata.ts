import { getCurrentYear, getStartOfNextNextMonth } from "~helpers";
import { fullyearFormat, monthnameFormat } from "~utils/dateFormats";

const nextMonth = getStartOfNextNextMonth();
const nextMonthName = nextMonth.format(monthnameFormat);
const currentYear = getCurrentYear().format(fullyearFormat);

const data = `
<html lang="en">
   <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Games | San Jose Barracuda</title>
      <meta name="author" content="San Jose Barracuda">
      <meta property="og:title" content="Games | San Jose Barracuda">
      <meta property="og:description" content="">
      <meta property="og:type" content="website">
      <meta property="og:url" content="http://www.sjbarracuda.com/games">
      <meta property="og:image" content="http://www.sjbarracuda.com/assets/img/default_thumb.jpg">
      <meta property="thumbnail" content="http://www.sjbarracuda.com/assets/img/default_thumb.jpg">
      <meta name="twitter:card" content="summary">
      <meta name="twitter:site" content="@SJBARRACUDA">
      <meta name="twitter:title" content="Games | San Jose Barracuda">
      <meta name="twitter:description" content="">
      <meta name="twitter:image" content="http://www.sjbarracuda.com/assets/img/default_thumb.jpg">
      <meta name="viewport" content="width=1200">
      <meta name="google-site-verification" content="7UOViYa1HdNvrzPEu9xms1soonuNslaaoGQFiI1NV8Y">
      <meta charset="UTF-8">
      <meta property="og:image" content="http://www.sjbarracuda.com/assets/img/default_thumb_322x322.jpg">
      <meta property="thumbnail" content="http://www.sjbarracuda.com/assets/img/default_thumb_322x322.jpg">
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
   </head>
   <body id="games">
      <div class="widget_inner noBleed" id="${nextMonthName}${currentYear}" style="opacity: 1;">
         <div class="widget_title_wrapper" data-dateid="#${nextMonthName}${currentYear}">
            <h2 class="game-month widget_title">${nextMonthName}</h2>
            <span class="title_right_content view_all_games arrow-up">close</span>
         </div>
         <div class="entry-wrapper">
            <div class="entry clearfix has-game-detail-text" data-toggle-target="438">
               <div class="date-time">
                  <span class="date">
                  Sat, ${nextMonthName} 1		</span>
                  <span class="time">
                  5:15PM		</span>
               </div>
               <div class="game_vs_message">
                  <div class="home-or-away">
                     Home		
                  </div>
                  <span>
                  VS		</span>
               </div>
               <div class="team-info">
                  <img src="http://www.sjbarracuda.com/assets/img/13796279_web1_Silver-Knights-2-7f9b941cb3.jpg" alt="">		<span class="team-title">
                  Henderson Silver Knights		</span>
               </div>
               <div class="game-detail">
                  <span class="game_outcome">Loss</span> 0-4 		
               </div>
               <div class="game-button">
                  <a href="http://www.sjbarracuda.com/watch" class="ahl-tv read-more" target="_blank">AHL TV</a><a href="http://www.sjbarracuda.com/listen" class="listen-live read-more" target="_blank">Listen Live</a><a href="http://www.sjbarracuda.com/#" class="open_promotions" data-toggle-target="438">Game Recap<i class="fa fa-angle-down"></i></a>	
               </div>
               <div class="game_promotions_container recap" data-toggle-id="438">
                  <div class="game_detail_reveal">
                     <div class="gameswidget content_item  " id="gameswidget_9999" data-layout="two_col_standard" data-order="0" content-id="9999" data-showtime-content="gameswidget">
                        <div class="widget_inner noBleed" style="opacity: 1;">
                           <div class="widget_title_wrapper">
                              <h2 class="widget_title">Game Center</h2>
                              <a href="http://www.sjbarracuda.com/games" class="view_all_games title_right_content">View All</a>	
                           </div>
                           <div class="widget_content_padding">
                              <div class="entry latest_game game_breakout ahl ">
                                 <div class="hometeam">
                                    <div class="thumb has_abbr">
                                       <div class="abbr">
                                          home						
                                       </div>
                                       <img src="http://www.sjbarracuda.com/assets/img/IG-Profile-9ee57ac3d2.jpg" alt="San Jose Barracuda">					
                                    </div>
                                    <div class="score has_abbr">
                                       <div class="abbr">
                                          1st							
                                       </div>
                                       0						
                                    </div>
                                    <div class="score has_abbr">
                                       <div class="abbr">
                                          2nd							
                                       </div>
                                       0						
                                    </div>
                                    <div class="score has_abbr">
                                       <div class="abbr">
                                          3rd							
                                       </div>
                                       0						
                                    </div>
                                    <div class="score final_score has_abbr">
                                       <div class="abbr">F</div>
                                       0					
                                    </div>
                                 </div>
                                 <div class="awayteam">
                                    <div class="thumb">
                                       <img src="http://www.sjbarracuda.com/assets/img/13796279_web1_Silver-Knights-2-7f9b941cb3.jpg" alt="Henderson Silver Knights">					
                                    </div>
                                    <div class="score">
                                       3						
                                    </div>
                                    <div class="score">
                                       1						
                                    </div>
                                    <div class="score">
                                       0						
                                    </div>
                                    <div class="score final_score">
                                       4					
                                    </div>
                                 </div>
                                 <div class="date">
                                    Sat, ${nextMonthName} 01 				
                                 </div>
                              </div>
                              <div class="upcoming_games  upcoming_games_three">
                                 <div class="entry">
                                    <div class="hometeam active">
                                       <div class="thumb has_abbr">
                                          <div class="abbr">
                                             Away					
                                          </div>
                                          <img src="http://www.sjbarracuda.com/assets/img/13796279_web1_Silver-Knights-2-7f9b941cb3.jpg" alt="Henderson Silver Knights">			
                                       </div>
                                    </div>
                                    <div class="details">
                                       <span class="time">
                                       Sat, ${nextMonthName} 08 			<span class="hour"> 1:00PM </span>
                                       </span>
                                    </div>
                                    <div class="button_wrapper circle-button inactive">
                                       <span class="tickets"> </span>
                                    </div>
                                 </div>
                                 <div class="entry">
                                    <div class="hometeam active">
                                       <div class="thumb has_abbr">
                                          <div class="abbr">
                                             Away					
                                          </div>
                                          <img src="http://www.sjbarracuda.com/assets/img/13796279_web1_Silver-Knights-2-7f9b941cb3.jpg" alt="Henderson Silver Knights">			
                                       </div>
                                    </div>
                                    <div class="details">
                                       <span class="time">
                                       Tue, ${nextMonthName} 11 			<span class="hour"> 7:00PM </span>
                                       </span>
                                    </div>
                                    <div class="button_wrapper circle-button inactive">
                                       <span class="tickets"> </span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="entry clearfix has-game-detail-text" data-toggle-target="451">
               <div class="date-time">
                  <span class="date">
                  Mon, ${nextMonthName} 3		</span>
                  <span class="time">
                  4:00PM		</span>
               </div>
               <div class="game_vs_message">
                  <div class="home-or-away">
                     Home		
                  </div>
                  <span>
                  VS		</span>
               </div>
               <div class="team-info">
                  <img src="http://www.sjbarracuda.com/assets/img/Bakersfield-f7cf2cc2be.jpg" alt="">		<span class="team-title">
                  Bakersfield Condors		</span>
               </div>
               <div class="game-detail">
                  <span class="game_outcome">Loss</span> 3-5 		
               </div>
               <div class="game-button">
                  <a href="http://www.sjbarracuda.com/watch" class="ahl-tv read-more" target="_blank">AHL TV</a><a href="http://www.sjbarracuda.com/listen" class="listen-live read-more" target="_blank">Listen Live</a><a href="http://www.sjbarracuda.com/#" class="open_promotions" data-toggle-target="451">Game Recap<i class="fa fa-angle-down"></i></a>	
               </div>
               <div class="game_promotions_container recap" data-toggle-id="451">
                  <div class="game_detail_reveal">
                     <div class="gameswidget content_item  " id="gameswidget_9999" data-layout="two_col_standard" data-order="0" content-id="9999" data-showtime-content="gameswidget">
                        <div class="widget_inner noBleed" style="opacity: 1;">
                           <div class="widget_title_wrapper">
                              <h2 class="widget_title">Game Center</h2>
                              <a href="http://www.sjbarracuda.com/games" class="view_all_games title_right_content">View All</a>	
                           </div>
                           <div class="widget_content_padding">
                              <div class="entry latest_game game_breakout ahl ">
                                 <div class="hometeam">
                                    <div class="thumb has_abbr">
                                       <div class="abbr">
                                          home						
                                       </div>
                                       <img src="http://www.sjbarracuda.com/assets/img/IG-Profile-9ee57ac3d2.jpg" alt="San Jose Barracuda">					
                                    </div>
                                    <div class="score has_abbr">
                                       <div class="abbr">
                                          1st							
                                       </div>
                                       1						
                                    </div>
                                    <div class="score has_abbr">
                                       <div class="abbr">
                                          2nd							
                                       </div>
                                       1						
                                    </div>
                                    <div class="score has_abbr">
                                       <div class="abbr">
                                          3rd							
                                       </div>
                                       1						
                                    </div>
                                    <div class="score final_score has_abbr">
                                       <div class="abbr">F</div>
                                       3					
                                    </div>
                                 </div>
                                 <div class="awayteam">
                                    <div class="thumb">
                                       <img src="http://www.sjbarracuda.com/assets/img/Bakersfield-f7cf2cc2be.jpg" alt="Bakersfield Condors">					
                                    </div>
                                    <div class="score">
                                       2						
                                    </div>
                                    <div class="score">
                                       0						
                                    </div>
                                    <div class="score">
                                       3						
                                    </div>
                                    <div class="score final_score">
                                       5					
                                    </div>
                                 </div>
                                 <div class="date">
                                    Mon, ${nextMonthName} 03 				
                                 </div>
                              </div>
                              <div class="upcoming_games  upcoming_games_three">
                                 <div class="entry">
                                    <div class="hometeam active">
                                       <div class="thumb has_abbr">
                                          <div class="abbr">
                                             Away					
                                          </div>
                                          <img src="http://www.sjbarracuda.com/assets/img/13796279_web1_Silver-Knights-2-7f9b941cb3.jpg" alt="Henderson Silver Knights">			
                                       </div>
                                    </div>
                                    <div class="details">
                                       <span class="time">
                                       Sat, ${nextMonthName} 08 			<span class="hour"> 1:00PM </span>
                                       </span>
                                    </div>
                                    <div class="button_wrapper circle-button inactive">
                                       <span class="tickets"> </span>
                                    </div>
                                 </div>
                                 <div class="entry">
                                    <div class="hometeam active">
                                       <div class="thumb has_abbr">
                                          <div class="abbr">
                                             Away					
                                          </div>
                                          <img src="http://www.sjbarracuda.com/assets/img/13796279_web1_Silver-Knights-2-7f9b941cb3.jpg" alt="Henderson Silver Knights">			
                                       </div>
                                    </div>
                                    <div class="details">
                                       <span class="time">
                                       Tue, ${nextMonthName} 11 			<span class="hour"> 7:00PM </span>
                                       </span>
                                    </div>
                                    <div class="button_wrapper circle-button inactive">
                                       <span class="tickets"> </span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="entry clearfix" data-toggle-target="441">
               <div class="date-time">
                  <span class="date">
                  Sat, ${nextMonthName} 8		</span>
                  <span class="time">
                  1:00PM		</span>
               </div>
               <div class="game_vs_message">
                  <div class="home-or-away">
                     Away		
                  </div>
                  <span>
                  AT		</span>
               </div>
               <div class="team-info">
                  <img src="http://www.sjbarracuda.com/assets/img/13796279_web1_Silver-Knights-2-7f9b941cb3.jpg" alt="">		<span class="team-title">
                  Henderson Silver Knights		</span>
               </div>
               <div class="game-button">
                  <a href="http://www.sjbarracuda.com/watch" class="ahl-tv read-more" target="_blank">AHL TV</a><a href="http://www.sjbarracuda.com/listen" class="listen-live read-more" target="_blank">Listen Live</a>	
               </div>
            </div>
            <div class="entry clearfix" data-toggle-target="442">
               <div class="date-time">
                  <span class="date">
                  Tue, ${nextMonthName} 11		</span>
                  <span class="time">
                  7:00PM		</span>
               </div>
               <div class="game_vs_message">
                  <div class="home-or-away">
                     Away		
                  </div>
                  <span>
                  AT		</span>
               </div>
               <div class="team-info">
                  <img src="http://www.sjbarracuda.com/assets/img/13796279_web1_Silver-Knights-2-7f9b941cb3.jpg" alt="">		<span class="team-title">
                  Henderson Silver Knights		</span>
               </div>
               <div class="game-button">
                  <a href="http://www.sjbarracuda.com/watch" class="ahl-tv read-more" target="_blank">AHL TV</a><a href="http://www.sjbarracuda.com/listen" class="listen-live read-more" target="_blank">Listen Live</a>	
               </div>
            </div>
         </div>
      </div>
   </body>
</html>
`;

export default data;
