// db/seedQuizzes.js - seeds the 5 football quizzes with 10 questions each
// Correct answers are distributed across A-D (never all the same letter).
// Usage: npm run seed-quizzes   (safe to re-run; skips quizzes that already have questions)
import { pool, query } from './index.js';

const QUIZZES = [
  {
    title: 'NFL History & Origins',
    category: 'History',
    description: 'League founding, merger history, iconic team origins, and early rules.',
    questions: [
      ['In what year was the American Professional Football Association (later the NFL) founded?', '1920', '1930', '1910', '1945', 'A', 'The APFA was founded in 1920 in Canton, Ohio, and was renamed the National Football League in 1922.'],
      ['What team joined the NFL in 1925 and is the only remaining franchise from that year?', 'Green Bay Packers', 'Chicago Cardinals (now Arizona Cardinals)', 'New York Giants', 'Detroit Lions', 'B', 'The Cardinals franchise dates to 1898 and joined the NFL in 1925, making it one of the oldest pro football franchises.'],
      ['Which AFL merged with the NFL in 1970?', 'All-America Football Conference (AAFC)', 'USFL', 'American Football League (AFL, 1960-1969)', 'WFL', 'C', 'The AFL-NFL merger was agreed in 1966 and completed in 1970, forming the modern NFC and AFC conferences.'],
      ['The Green Bay Packers were founded in which year?', '1933', '1921', '1945', '1919', 'D', 'The Packers were founded in 1919 by Earl "Curly" Lambeau and joined the NFL in 1921.'],
      ['Which Hall of Fame is located in Canton, Ohio?', 'Pro Football Hall of Fame', 'College Football Hall of Fame', 'NFL Museum', 'American Football Museum', 'A', 'The Pro Football Hall of Fame opened in Canton in 1963, honoring the game\'s greatest players and coaches.'],
      ['What was the first championship game called before "Super Bowl"?', 'The Gridiron Bowl', 'NFL Championship Game (and later AFL-NFL World Championship Game)', 'Pro Bowl', 'World Bowl', 'B', 'From 1933 to 1965 the NFL Championship Game decided the league title; the first "Super Bowl" name was used in 1967.'],
      ['Which team was originally named the New York Titans?', 'New York Giants', 'Buffalo Bills', 'New York Jets', 'Buffalo Bisons', 'C', 'The Titans of New York (AFL, 1960) were renamed the Jets in 1963.'],
      ['Which NFL franchise began as the Boston Patriots?', 'Pittsburgh Steelers', 'Philadelphia Eagles', 'Washington Commanders', 'New England Patriots', 'D', 'The Boston Patriots (AFL, 1960) moved to Foxborough and became the New England Patriots in 1971.'],
      ['The forward pass was legalized largely thanks to rule changes in which decade?', '1900s (1906)', '1880s', '1920s', '1950s', 'A', 'The forward pass was legalized in 1906 to reduce violence and open up the game.'],
      ['Which team relocated from Cleveland to Baltimore in 1996?', 'Cleveland Browns became the Indianapolis Colts', 'Cleveland Browns became the Baltimore Ravens', 'Cleveland Rams became the St. Louis Rams', 'Cleveland Tigers became the Detroit Lions', 'B', 'Art Modell moved the Browns to Baltimore in 1996; the Browns name and history returned to Cleveland in 1999.'],
    ],
  },
  {
    title: 'Super Bowl Highlights',
    category: 'Super Bowl',
    description: 'Championship games, MVP performances, scoring records, and dynasties.',
    questions: [
      ['Which team won Super Bowl I (1967)?', 'Green Bay Packers', 'Kansas City Chiefs', 'Dallas Cowboys', 'New England Patriots', 'A', 'The Packers beat the Chiefs 35-10 in the first AFL-NFL World Championship Game.'],
      ['How many Super Bowls did the Pittsburgh Steelers win in the 1970s?', 'Two', 'Four', 'Three', 'Five', 'B', 'Pittsburgh won Super Bowls IX, X, XIII, and XIV — four titles in six seasons.'],
      ['Who is the only player to win Super Bowl MVP three times?', 'Joe Montana', 'Patrick Mahomes', 'Tom Brady', 'Terry Bradshaw', 'C', 'Tom Brady won Super Bowl MVP with the Patriots in XXXVI, XXXVIII, and with Tampa Bay in LV.'],
      ['What number Super Bowl is known for the " Philly Special" trick play?', 'LI (51)', 'XLIX (49)', 'XLII (42)', 'LII (52)', 'D', 'The Eagles\' Philly Special touchdown helped beat the Patriots 41-33 in Super Bowl LII.'],
      ['Which QB led the Patriots to the largest Super Bowl comeback (25 points)?', 'Tom Brady', 'Nick Foles', 'Peyton Manning', 'Russell Wilson', 'A', 'New England overcame a 28-3 deficit to beat Atlanta 34-28 in OT in Super Bowl LI.'],
      ['Which team lost four consecutive Super Bowls in the early 1990s?', 'Denver Broncos', 'Buffalo Bills', 'Minnesota Vikings', 'Cincinnati Bengals', 'B', 'The Bills lost Super Bowls XXV-XXVIII, 1991-1994, despite four straight AFC titles.'],
      ['Who kicked the longest field goal in Super Bowl history (54 yards)?', 'Adam Vinatieri', 'Harrison Butker', 'Steve Christie', 'Greg Zuerlein', 'C', 'Buffalo\'s Steve Christie hit a 54-yarder in Super Bowl XXVIII.'],
      ['Which team won Super Bowl LV (55) in Tom Brady\'s first season with them?', 'New England Patriots', 'Kansas City Chiefs', 'Green Bay Packers', 'Tampa Bay Buccaneers', 'D', 'The Bucs beat Kansas City 31-9 — the first team to win a Super Bowl in its home stadium.'],
      ['Who caught the game-winning catch in Super Bowl XLII to end the Patriots\' perfect season?', 'David Tyree', 'Plaxico Burress', 'Mario Manningham', 'Julian Edelman', 'A', 'Tyree\'s "helmet catch" helped the Giants upset undefeated New England 17-14.'],
      ['The Kansas City Chiefs won Super Bowls LVII and LVIII behind which quarterback?', 'Alex Smith', 'Patrick Mahomes', 'Joe Montana', 'Trent Green', 'B', 'Mahomes won back-to-back Super Bowls in the 2022 and 2023 seasons.'],
    ],
  },
  {
    title: 'Rules, Positions & Scoring',
    category: 'Rules',
    description: 'Penalties, field geometry, player roles, and scoring mechanics.',
    questions: [
      ['How many points is a touchdown worth?', 'Six', 'Seven', 'Three', 'Five', 'A', 'A touchdown is 6 points, plus 1 for the extra point or 2 for a two-point conversion.'],
      ['How long is a standard NFL football field (excluding end zones)?', '90 yards', '100 yards', '110 yards', '120 yards', 'B', 'The playing field is 100 yards, with two 10-yard end zones (120 yards total).'],
      ['How many points is a safety worth?', 'Three', 'One', 'Two', 'Six', 'C', 'A safety scores 2 points for the defense when the offense is tackled in its own end zone.'],
      ['How many players does each team have on the field at once?', 'Ten', 'Twelve', 'Nine', 'Eleven', 'D', 'Each side fields 11 players — offense, defense, and special teams alike.'],
      ['What penalty is called for a false start?', 'Five yards', 'Ten yards', 'Fifteen yards', 'Loss of down', 'A', 'A false start is a 5-yard penalty on the offense.'],
      ['What is the role of the offensive "pocket"?', 'The area where kicks are teed up', 'The protected area where the quarterback drops back to pass', 'The bench area', 'The end zone corner', 'B', 'The pocket is the moving protected zone behind the line of scrimmage formed by the linemen.'],
      ['Which position primarily throws forward passes?', 'Running back', 'Tight end', 'Quarterback', 'Linebacker', 'C', 'The QB is the offensive leader who takes the snap and usually throws the passes.'],
      ['A field goal is worth how many points?', 'Two', 'Four', 'Six', 'Three', 'D', 'Successful field goals score 3 points.'],
      ['What does "3rd and 7" mean?', 'Third down with 7 yards to go for a first down', 'Third quarter with 7 minutes left', 'Third drive, 7th play', '3 defenders, 7 blockers', 'A', 'Down-and-distance: 3rd down, needing 7 more yards to reach a fresh set of downs.'],
      ['How many yards must the offense gain for a new set of downs?', 'Five', 'Ten', 'Fifteen', 'Seven', 'B', 'The offense has four downs to gain 10 yards and earn a new set.'],
    ],
  },
  {
    title: 'All-Time Greats',
    category: 'Legends',
    description: 'Hall of Fame QBs, defensive icons, rushing leaders, and career milestones.',
    questions: [
      ['Who holds the NFL record for career passing yards (as of 2024)?', 'Tom Brady', 'Drew Brees', 'Peyton Manning', 'Brett Favre', 'A', 'Tom Brady retired with over 89,000 passing yards, the most in NFL history.'],
      ['Who is the NFL\'s all-time leading rusher?', 'Walter Payton', 'Emmitt Smith', 'Barry Sanders', 'Jim Brown', 'B', 'Emmitt Smith rushed for 18,355 yards, mostly with the Dallas Cowboys.'],
      ['Which linebacker is famous for the "Mean Joe" nickname and the Coke commercial?', 'Joe Montana', 'Jack Lambert', 'Joe Greene', 'Lawrence Taylor', 'C', '"Mean" Joe Greene anchored Pittsburgh\'s Steel Curtain defense.'],
      ['Who holds the single-season touchdown reception record (as of 2024)?', 'Jerry Rice (22)', 'Calvin Johnson (16)', 'Tyreek Hill (14)', 'Randy Moss (23, 2007)', 'D', 'Randy Moss caught 23 TD passes with the Patriots in 2007.'],
      ['Which receiver is the NFL\'s all-time leader in receiving yards and touchdowns?', 'Jerry Rice', 'Randy Moss', 'Terrell Owens', 'Larry Fitzgerald', 'A', 'Jerry Rice holds the career records for receptions, yards, and receiving TDs.'],
      ['Who is widely regarded as the greatest defensive end of the 1980s, drafted by the Giants?', 'Reggie White', 'Lawrence Taylor', 'Bruce Smith', 'Deion Sanders', 'B', 'LT revolutionized the outside linebacker position and won three Defensive Player of the Year awards.'],
      ['Which QB holds the record for most career touchdown passes (as of 2024)?', 'Peyton Manning', 'Drew Brees', 'Tom Brady', 'Aaron Rodgers', 'C', 'Brady threw 649 regular-season touchdown passes.'],
      ['Who was the first player to rush for 2,000 yards in a season?', 'Eric Dickerson', 'Barry Sanders', 'Adrian Peterson', 'O.J. Simpson (1973)', 'D', 'O.J. Simpson hit 2,003 yards in just 14 games in 1973.'],
      ['Which QB led the Broncos to back-to-back Super Bowls in the late 1990s?', 'John Elway', 'Peyton Manning', 'Tim Tebow', 'Craig Morton', 'A', 'Elway won Super Bowls XXXII and XXXIII, his final two seasons.'],
      ['Which kicker is the NFL\'s all-time leading scorer?', 'Morten Andersen', 'Adam Vinatieri', 'Gary Anderson', 'Justin Tucker', 'B', 'Vinatieri scored 2,487 points and hit iconic clutch kicks.'],
    ],
  },
  {
    title: 'College Football & Trophies',
    category: 'College',
    description: 'Heisman legends, bowl traditions, rivalries, and championship lore.',
    questions: [
      ['What trophy is awarded to the most outstanding player in college football?', 'Heisman Trophy', 'Lombardi Trophy', 'Outland Trophy', 'Davey O\'Brien Award', 'A', 'The Heisman Trophy has been awarded annually since 1935.'],
      ['Which school has won the most Heisman Trophies?', 'Alabama', 'USC', 'Ohio State', 'Oklahoma', 'B', 'USC Trojans players have won 8 Heismans (some later vacated).'],
      ['Who won the 2023 Heisman Trophy as LSU\'s quarterback?', 'Bo Nix', 'Michael Penix Jr.', 'Jayden Daniels', 'J.J. McCarthy', 'C', 'Jayden Daniels won the 2023 Heisman with an extraordinary dual-threat season.'],
      ['Which bowl game is nicknamed "The Granddaddy of Them All"?', 'Sugar Bowl', 'Orange Bowl', 'Cotton Bowl', 'Rose Bowl', 'D', 'The Rose Bowl, first played in 1902, is college football\'s oldest bowl game.'],
      ['The rivalry between Ohio State and Michigan is commonly known by what nickname?', 'The Game', 'The Iron Bowl', 'The Red River Rivalry', 'The Civil War', 'A', 'Ohio State vs. Michigan, first played in 1897, is simply called "The Game."'],
      ['Which trophy goes to the winner of the Iron Bowl?', 'Paul Bunyan Trophy', 'Foy-ODK Sportsmanship Trophy', 'Landmark Trophy', 'Victory Bell', 'B', 'Alabama and Auburn battle for the Foy-ODK Trophy in the Iron Bowl.'],
      ['Which two teams compete in the Red River Rivalry?', 'Oklahoma vs. Oklahoma State', 'Texas vs. Texas A&M', 'Oklahoma vs. Texas', 'Kansas vs. Kansas State', 'C', 'The rivalry is played at the Cotton Bowl in Dallas during the State Fair of Texas.'],
      ['Which player won the first College Football Playoff National Championship game MVP for Ohio State (2015)?', 'Cardale Jones', 'J.T. Barrett', 'Braxton Miller', 'Ezekiel Elliott', 'D', 'Elliott rushed for 246 yards and 4 TDs in the title game win over Oregon.'],
      ['What was the name of the system that determined the national championship from 1998-2013?', 'Bowl Championship Series (BCS)', 'College Football Playoff', 'AP Poll only', 'Coaches Poll only', 'A', 'The BCS used polls and computer rankings to pair #1 vs. #2 in a title game.'],
      ['Army and Navy play their annual game for which trophy?', 'Victory Bell', 'Commander-in-Chief\'s Trophy (with Air Force)', 'Iron Skillet', 'Megaphone Trophy', 'B', 'The Commander-in-Chief\'s Trophy goes to the service academy with the best record among the three.'],
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
