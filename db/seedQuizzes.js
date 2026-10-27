// db/seedQuizzes.js - seeds the 5 football quizzes with 10 questions each
// Usage: npm run seed-quizzes   (safe to re-run; skips quizzes that already have questions)
import { pool, query } from './index.js';

const QUIZZES = [
  {
    title: 'NFL History & Origins',
    category: 'History',
    description: 'League founding, merger history, iconic team origins, and early rules.',
    questions: [
      ['In what year was the American Professional Football Association (later the NFL) founded?', '1920', '1930', '1910', '1945', 'A', 'The APFA was founded in 1920 in Canton, Ohio, and was renamed the National Football League in 1922.'],
      ['What team joined the NFL in 1925 and is the only remaining franchise from that year?', 'Chicago Cardinals (now Arizona Cardinals)', 'Green Bay Packers', 'New York Giants', 'Detroit Lions', 'A', 'The Cardinals franchise dates to 1898 and joined the NFL in 1925, making it one of the oldest pro football franchises.'],
      ['Which AFL merged with the NFL in 1970?', 'American Football League (AFL, 1960-1969)', 'All-America Football Conference (AAFC)', 'USFL', 'WFL', 'A', 'The AFL-NFL merger was agreed in 1966 and completed in 1970, forming the modern NFC and AFC conferences.'],
      ['The Green Bay Packers were founded in which year?', '1919', '1933', '1921', '1945', 'A', 'The Packers were founded in 1919 by Earl "Curly" Lambeau and joined the NFL in 1921.'],
      ['Which Hall of Fame is located in Canton, Ohio?', 'Pro Football Hall of Fame', 'College Football Hall of Fame', 'NFL Museum', 'American Football Museum', 'A', 'The Pro Football Hall of Fame opened in Canton in 1963, honoring the game\'s greatest players and coaches.'],
      ['What was the first championship game called before "Super Bowl"?', 'NFL Championship Game (and later AFL-NFL World Championship Game)', 'The Gridiron Bowl', 'Pro Bowl', 'World Bowl', 'A', 'From 1933 to 1965 the NFL Championship Game decided the league title; the first "Super Bowl" name was used in 1967.'],
      ['Which team was originally named the New York Titans?', 'New York Jets', 'New York Giants', 'Buffalo Bills', 'Buffalo Bisons', 'A', 'The Titans of New York (AFL, 1960) were renamed the Jets in 1963.'],
      ['Which NFL franchise began as the Boston Patriots?', 'New England Patriots', 'Pittsburgh Steelers', 'Philadelphia Eagles', 'Washington Commanders', 'A', 'The Boston Patriots (AFL, 1960) moved to Foxborough and became the New England Patriots in 1971.'],
      ['The forward pass was legalized largely thanks to rule changes in which decade?', '1900s (1906)', '1880s', '1920s', '1950s', 'A', 'The forward pass was legalized in 1906 to reduce violence and open up the game.'],
      ['Which team relocated from Cleveland to Baltimore in 1996?', 'Cleveland Browns became the Baltimore Ravens', 'Cleveland Browns became the Indianapolis Colts', 'Cleveland Rams became the St. Louis Rams', 'Cleveland Tigers became the Detroit Lions', 'A', 'Art Modell moved the Browns to Baltimore in 1996; the Browns name and history returned to Cleveland in 1999.'],
    ],
  },
  {
    title: 'Super Bowl Highlights',
    category: 'Super Bowl',
    description: 'Championship games, MVP performances, scoring records, and dynasties.',
    questions: [
      ['Which team won Super Bowl I (1967)?', 'Green Bay Packers', 'Kansas City Chiefs', 'Dallas Cowboys', 'New England Patriots', 'A', 'The Packers beat the Chiefs 35-10 in the first AFL-NFL World Championship Game.'],
      ['How many Super Bowls did the Pittsburgh Steelers win in the 1970s?', 'Four', 'Two', 'Three', 'Five', 'A', 'Pittsburgh won Super Bowls IX, X, XIII, and XIV — four titles in six seasons.'],
      ['Who is the only player to win Super Bowl MVP three times?', 'Tom Brady', 'Joe Montana', 'Patrick Mahomes', 'Terry Bradshaw', 'A', 'Tom Brady won Super Bowl MVP with the Patriots in XXXVI, XXXVIII, and with Tampa Bay in LV.'],
      ['What number Super Bowl is known for the " Philly Special" trick play?', 'LII (52)', 'LI (51)', 'XLIX (49)', 'XLII (42)', 'A', 'The Eagles\' Philly Special touchdown helped beat the Patriots 41-33 in Super Bowl LII.'],
      ['Which QB led the Patriots to the largest Super Bowl comeback (25 points)?', 'Tom Brady', 'Nick Foles', 'Peyton Manning', 'Russell Wilson', 'A', 'New England overcame a 28-3 deficit to beat Atlanta 34-28 in OT in Super Bowl LI.'],
      ['Which team lost four consecutive Super Bowls in the early 1990s?', 'Buffalo Bills', 'Denver Broncos', 'Minnesota Vikings', 'Cincinnati Bengals', 'A', 'The Bills lost Super Bowls XXV-XXVIII, 1991-1994, despite four straight AFC titles.'],
      ['Who kicked the longest field goal in Super Bowl history (54 yards)?', 'Steve Christie', 'Adam Vinatieri', 'Harrison Butker', 'Greg Zuerlein', 'A', 'Buffalo\'s Steve Christie hit a 54-yarder in Super Bowl XXVIII.'],
      ['Which team won Super Bowl LV (55) in Tom Brady\'s first season with them?', 'Tampa Bay Buccaneers', 'New England Patriots', 'Kansas City Chiefs', 'Green Bay Packers', 'A', 'The Bucs beat Kansas City 31-9 — the first team to win a Super Bowl in its home stadium.'],
      ['Who caught the game-winning catch in Super Bowl XLII to end the Patriots\' perfect season?', 'David Tyree', 'Plaxico Burress', 'Mario Manningham', 'Julian Edelman', 'A', 'Tyree\'s "helmet catch" helped the Giants upset undefeated New England 17-14.'],
      ['The Kansas City Chiefs won Super Bowls LVII and LVIII behind which quarterback?', 'Patrick Mahomes', 'Alex Smith', 'Joe Montana', 'Trent Green', 'A', 'Mahomes won back-to-back Super Bowls in the 2022 and 2023 seasons.'],
    ],
  },
  {
    title: 'Rules, Positions & Scoring',
    category: 'Rules',
    description: 'Penalties, field geometry, player roles, and scoring mechanics.',
    questions: [
      ['How many points is a touchdown worth?', 'Six', 'Seven', 'Three', 'Five', 'A', 'A touchdown is 6 points, plus 1 for the extra point or 2 for a two-point conversion.'],
      ['How long is a standard NFL football field (excluding end zones)?', '100 yards', '90 yards', '110 yards', '120 yards', 'A', 'The playing field is 100 yards, with two 10-yard end zones (120 yards total).'],
      ['How many points is a safety worth?', 'Two', 'Three', 'One', 'Six', 'A', 'A safety scores 2 points for the defense when the offense is tackled in its own end zone.'],
      ['How many players does each team have on the field at once?', 'Eleven', 'Ten', 'Twelve', 'Nine', 'A', 'Each side fields 11 players — offense, defense, and special teams alike.'],
      ['What penalty is called for a false start?', 'Five yards', 'Ten yards', 'Fifteen yards', 'Loss of down', 'A', 'A false start is a 5-yard penalty on the offense.'],
      ['What is the role of the offensive "pocket"?', 'The protected area where the quarterback drops back to pass', 'The area where kicks are teed up', 'The bench area', 'The end zone corner', 'A', 'The pocket is the moving protected zone behind the line of scrimmage formed by the linemen.'],
      ['Which position primarily throws forward passes?', 'Quarterback', 'Running back', 'Tight end', 'Linebacker', 'A', 'The QB is the offensive leader who takes the snap and usually throws the passes.'],
      ['A field goal is worth how many points?', 'Three', 'Two', 'Four', 'Six', 'A', 'Successful field goals score 3 points.'],
      ['What does "3rd and 7" mean?', 'Third down with 7 yards to go for a first down', 'Third quarter with 7 minutes left', 'Third drive, 7th play', '3 defenders, 7 blockers', 'A', 'Down-and-distance: 3rd down, needing 7 more yards to reach a fresh set of downs.'],
      ['How many yards must the offense gain for a new set of downs?', 'Ten', 'Five', 'Fifteen', 'Seven', 'A', 'The offense has four downs to gain 10 yards and earn a new set.'],
    ],
  },
  {
    title: 'All-Time Greats',
    category: 'Legends',
    description: 'Hall of Fame QBs, defensive icons, rushing leaders, and career milestones.',
    questions: [
      ['Who holds the NFL record for career passing yards (as of 2024)?', 'Tom Brady', 'Drew Brees', 'Peyton Manning', 'Brett Favre', 'A', 'Tom Brady retired with over 89,000 passing yards, the most in NFL history.'],
      ['Who is the NFL\'s all-time leading rusher?', 'Emmitt Smith', 'Walter Payton', 'Barry Sanders', 'Jim Brown', 'A', 'Emmitt Smith rushed for 18,355 yards, mostly with the Dallas Cowboys.'],
      ['Which linebacker is famous for the "Mean Joe" nickname and the Coke commercial?', 'Joe Greene', 'Joe Montana', 'Jack Lambert', 'Lawrence Taylor', 'A', '"Mean" Joe Greene anchored Pittsburgh\'s Steel Curtain defense.'],
      ['Who holds the single-season touchdown reception record (as of 2024)?', 'Randy Moss (23, 2007)', 'Jerry Rice (22)', 'Calvin Johnson (16)', 'Tyreek Hill (14)', 'A', 'Randy Moss caught 23 TD passes with the Patriots in 2007.'],
      ['Which receiver is the NFL\'s all-time leader in receiving yards and touchdowns?', 'Jerry Rice', 'Randy Moss', 'Terrell Owens', 'Larry Fitzgerald', 'A', 'Jerry Rice holds the career records for receptions, yards, and receiving TDs.'],
      ['Who is widely regarded as the greatest defensive end of the 1980s, drafted by the Giants?', 'Lawrence Taylor', 'Reggie White', 'Bruce Smith', 'Deion Sanders', 'A', 'LT revolutionized the outside linebacker position and won three Defensive Player of the Year awards.'],
      ['Which QB holds the record for most career touchdown passes (as of 2024)?', 'Tom Brady', 'Peyton Manning', 'Drew Brees', 'Aaron Rodgers', 'A', 'Brady threw 649 regular-season touchdown passes.'],
      ['Who was the first player to rush for 2,000 yards in a season?', 'O.J. Simpson (1973)', 'Eric Dickerson', 'Barry Sanders', 'Adrian Peterson', 'A', 'O.J. Simpson hit 2,003 yards in just 14 games in 1973.'],
      ['Which QB led the Broncos to back-to-back Super Bowls in the late 1990s?', 'John Elway', 'Peyton Manning', 'Tim Tebow', 'Craig Morton', 'A', 'Elway won Super Bowls XXXII and XXXIII, his final two seasons.'],
      ['Which kicker is the NFL\'s all-time leading scorer?', 'Adam Vinatieri', 'Morten Andersen', 'Gary Anderson', 'Justin Tucker', 'A', 'Vinatieri scored 2,487 points and hit iconic clutch kicks.'],
    ],
  },
  {
    title: 'College Football & Trophies',
    category: 'College',
    description: 'Heisman legends, bowl traditions, rivalries, and championship lore.',
    questions: [
      ['What trophy is awarded to the most outstanding player in college football?', 'Heisman Trophy', 'Lombardi Trophy', 'Outland Trophy', 'Davey O\'Brien Award', 'A', 'The Heisman Trophy has been awarded annually since 1935.'],
      ['Which school has won the most Heisman Trophies?', 'USC', 'Alabama', 'Ohio State', 'Oklahoma', 'A', 'USC Trojans players have won 8 Heismans (some later vacated).'],
      ['Who won the 2023 Heisman Trophy as LSU\'s quarterback?', 'Jayden Daniels', 'Bo Nix', 'Michael Penix Jr.', 'J.J. McCarthy', 'A', 'Jayden Daniels won the 2023 Heisman with an extraordinary dual-threat season.'],
      ['Which bowl game is nicknamed "The Granddaddy of Them All"?', 'Rose Bowl', 'Sugar Bowl', 'Orange Bowl', 'Cotton Bowl', 'A', 'The Rose Bowl, first played in 1902, is college football\'s oldest bowl game.'],
      ['The rivalry between Ohio State and Michigan is commonly known by what nickname?', 'The Game', 'The Iron Bowl', 'The Red River Rivalry', 'The Civil War', 'A', 'Ohio State vs. Michigan, first played in 1897, is simply called "The Game."'],
      ['Which trophy goes to the winner of the Iron Bowl?', 'Foy-ODK Sportsmanship Trophy', 'Paul Bunyan Trophy', 'Landmark Trophy', 'Victory Bell', 'A', 'Alabama and Auburn battle for the Foy-ODK Trophy in the Iron Bowl.'],
      ['Which two teams compete in the Red River Rivalry?', 'Oklahoma vs. Texas', 'Oklahoma vs. Oklahoma State', 'Texas vs. Texas A&M', 'Kansas vs. Kansas State', 'A', 'The rivalry is played at the Cotton Bowl in Dallas during the State Fair of Texas.'],
      ['Which player won the first College Football Playoff National Championship game MVP for Ohio State (2015)?', 'Ezekiel Elliott', 'Cardale Jones', 'J.T. Barrett', 'Braxton Miller', 'A', 'Elliott rushed for 246 yards and 4 TDs in the title game win over Oregon.'],
      ['What was the name of the system that determined the national championship from 1998-2013?', 'Bowl Championship Series (BCS)', 'College Football Playoff', 'AP Poll only', 'Coaches Poll only', 'A', 'The BCS used polls and computer rankings to pair #1 vs. #2 in a title game.'],
      ['Army and Navy play their annual game for which trophy?', 'Commander-in-Chief\'s Trophy (with Air Force)', 'Victory Bell', 'Iron Skillet', 'Megaphone Trophy', 'A', 'The Commander-in-Chief\'s Trophy goes to the service academy with the best record among the three.'],
    ],
  },
];

async function seed() {
  try {
    for (const quiz of QUIZZES) {
      const { rows } = await query(
        'INSERT INTO quizzes (title, category, description) VALUES ($1, $2, $3) ON CONFLICT (title) DO UPDATE SET category = EXCLUDED.category, description = EXCLUDED.description RETURNING id',
        [quiz.title, quiz.category, quiz.description]
      );
      const quizId = rows[0].id;

      const existing = await query('SELECT COUNT(*)::int AS n FROM questions WHERE quiz_id = $1', [quizId]);
      if (existing.rows[0].n > 0) {
        console.log(`- ${quiz.title}: already has ${existing.rows[0].n} questions, skipping`);
        continue;
      }

      for (const [text, a, b, c, d, correct, explanation] of quiz.questions) {
        await query(
          'INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [quizId, text, a, b, c, d, correct, explanation]
        );
      }
      console.log(`- ${quiz.title}: added ${quiz.questions.length} questions`);
    }
    console.log('Quiz seeding complete.');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
