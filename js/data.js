/* CompassMatch — data: questions, answers, figures, countries & ideologies */

/* ---------- Quiz levels ---------- */
const LEVELS = [
  { n: 10, color: "#E0A11B", nameKey: "level.quick" },   // amber — fast / rough
  { n: 20, color: "#3B9BE0", nameKey: "level.standard" }, // blue  — balanced
  { n: 30, color: "#8B5CF6", nameKey: "level.deep" },     // purple — most accurate
];
let currentLevel = 20;

/* Pick `n` questions spread evenly across the pool so every level is a
   representative sample (level 3 uses the whole pool). */
function selectQuestions(n) {
  if (n >= QUESTIONS.length) return QUESTIONS.slice();
  const picked = [];
  const step = QUESTIONS.length / n;
  for (let i = 0; i < n; i++) picked.push(QUESTIONS[Math.floor(i * step)]);
  return picked;
}

/* ---------- Axes ----------
   econ — negative = left, positive = right
   auth — negative = libertarian, positive = authoritarian
   Each answer ranges -2 (strongly disagree) to +2 (strongly agree). */

const QUESTIONS = [
  { q: { en: "Taxation is an acceptable tool to reduce wealth inequality.", el: "Η φορολόγηση είναι αποδεκτό εργαλείο για τη μείωση της οικονομικής ανισότητας.", de: "Steuern sind ein akzeptables Mittel, um wirtschaftliche Ungleichheit zu verringern." }, econ: -2,   auth: 0    },
  { q: { en: "The free market, left largely alone, produces the best outcomes.", el: "Η ελεύθερη αγορά, αφεμένη κυρίως στην τύχη της, παράγει τα καλύτερα αποτελέσματα.", de: "Der freie Markt, sich selbst überlassen, erzeugt die besten Ergebnisse." }, econ: 2,    auth: 0    },
  { q: { en: "Healthcare should be fully public and funded by the state.", el: "Η υγειονομική περίθαλψη πρέπει να είναι πλήρως δημόσια και χρηματοδοτούμενη από το κράτος.", de: "Das Gesundheitswesen sollte vollständig öffentlich und staatlich finanziert sein." }, econ: -2,   auth: 0.5  },
  { q: { en: "Government should not regulate business beyond enforcing contracts.", el: "Η κυβέρνηση δεν πρέπει να ρυθμίζει τις επιχειρήσεις πέρα από την επιβολή των συμβολαίων.", de: "Die Regierung sollte das Wirtschaftsleben nicht über die Durchsetzung von Verträgen hinaus regulieren." }, econ: 2,    auth: -0.5 },
  { q: { en: "Labor unions have too much power in society today.", el: "Οι συνδικάτες έχουν πολύ μεγάλη δύναμη στην κοινωνία σήμερα.", de: "Gewerkschaften haben heute zu viel Macht in der Gesellschaft." }, econ: 1.5,  auth: 0.5  },
  { q: { en: "Wealthy people largely deserve the fortunes they accumulate.", el: "Οι πλούσιοι κατά βάση αξίζουν τις περιουσίες που συγκεντρώνουν.", de: "Reiche Menschen verdienen die Reichtümer, die sie anhäufen, weitgehend selbst." }, econ: 2,    auth: 0    },
  { q: { en: "Higher education should be free and publicly funded.", el: "Η τριτοβάθμια εκπαίδευση πρέπει να είναι δωρεάν και δημόσια χρηματοδοτούμενη.", de: "Höhere Bildung sollte kostenlos und öffentlich finanziert sein." }, econ: -2,   auth: 0    },
  { q: { en: "Climate change justifies significant economic regulation.", el: "Η κλιματική αλλαγή δικαιολογεί σημαντική οικονομική ρύθμιση.", de: "Der Klimawandel rechtfertigt eine bedeutende wirtschaftliche Regulierung." }, econ: -1.5, auth: 0.5  },
  { q: { en: "Traditional values are the foundation of a healthy society.", el: "Οι παραδοσιακές αξίες είναι το θεμέλιο μιας υγιούς κοινωνίας.", de: "Traditionelle Werte sind das Fundament einer gesunden Gesellschaft." }, econ: 0.5,  auth: 2    },
  { q: { en: "Same-sex marriage should be legal everywhere.", el: "Ο γάμος ομοφυλόφυλων πρέπει να είναι νόμιμος παντού.", de: "Die Ehe gleichgeschlechtlicher Paare sollte überall legal sein." }, econ: 0,    auth: -2   },
  { q: { en: "Early-term abortion should be legal and accessible.", el: "Η έκτρωση στα πρώτα στάδια πρέπει να είναι νόμιμη και προσβάσιμη.", de: "Abtreibung in einem frühen Stadium sollte legal und zugänglich sein." }, econ: 0,    auth: -2   },
  { q: { en: "Drug use should be decriminalized and treated as a health issue.", el: "Η χρήση ναρκωτικών πρέπει να αποποινικοποιηθεί και να αντιμετωπιστεί ως θέμα υγείας.", de: "Drogenkonsum sollte entkriminalisiert und als Gesundheitsproblem behandelt werden." }, econ: -0.5, auth: -2   },
  { q: { en: "The government should be able to monitor citizens to prevent crime.", el: "Η κυβέρνηση πρέπει να μπορεί να παρακολουθεί τους πολίτες για να προλαμβάνει το έγκλημα.", de: "Die Regierung sollte Bürger überwachen können, um Verbrechen zu verhindern." }, econ: 0,    auth: 2    },
  { q: { en: "A strong military is the most important national priority.", el: "Ένα ισχυρό στρατό είναι η σημαντικότερη εθνική προτεραιότητα.", de: "Eine starke Militärmacht ist die wichtigste nationale Priorität." }, econ: 0.5,  auth: 2    },
  { q: { en: "Protests that disrupt public order should be shut down by police.", el: "Οι διαμαρτυρίες που διαταράσσουν τη δημόσια τάξη πρέπει να καταστέλλονται από την αστυνομία.", de: "Proteste, die die öffentliche Ordnung stören, sollten von der Polizei aufgelöst werden." }, econ: 0.3,  auth: 2    },
  { q: { en: "Immigration is generally good for the economy and society.", el: "Η μετανάστευση είναι γενικά καλή για την οικονομία και την κοινωνία.", de: "Einwanderung ist im Allgemeinen gut für Wirtschaft und Gesellschaft." }, econ: -0.5, auth: -1.5 },
  { q: { en: "Public transportation should be heavily subsidized by the government.", el: "Τα μέσα μαζικής μεταφοράς πρέπει να επιδοτούνται σημαντικά από την κυβέρνηση.", de: "Der öffentliche Verkehr sollte stark vom Staat subventioniert werden." }, econ: -1.5, auth: 0.5 },
  { q: { en: "Big corporations have too much influence over government.", el: "Οι μεγάλες εταιρείες έχουν πολύ μεγάλη επιρροή στην κυβέρνηση.", de: "Große Konzerne haben zu viel Einfluss auf die Regierung." }, econ: -1.5, auth: 0 },
  { q: { en: "Housing is a human right, not a commodity.", el: "Το στέγη είναι ανθρώπινο δικαίωμα, όχι εμπόρευμα.", de: "Wohnen ist ein Menschenrecht, keine Ware." }, econ: -2,   auth: 0.5 },
  { q: { en: "Inheritance should be heavily taxed to fund public services.", el: "Η κληρονομιά πρέπει να φορολογείται βαριά για να χρηματοδοτήσει δημόσιες υπηρεσίες.", de: "Erbschaften sollten stark besteuert werden, um öffentliche Dienste zu finanzieren." }, econ: -1.5, auth: 0 },
  { q: { en: "A single flat tax rate would be fairer than a progressive one.", el: "Ένα επίπεδο φορολογικό ποσοστό θα ήταν πιο δίκαιο από ένα προοδευτικό.", de: "Ein einheitlicher Steuersatz wäre fairer als ein progressiver." }, econ: 2,    auth: -0.5 },
  { q: { en: "Rent control helps keep cities affordable.", el: "Ο έλεγχος των ενοικίων βοηθά τις πόλεις να παραμείνουν προσιτές.", de: "Mietpreisbindungen helfen, Städte bezahlbar zu halten." }, econ: -1.5, auth: 0.5 },
  { q: { en: "The death penalty is an acceptable punishment for the worst crimes.", el: "Η θανατική ποινή είναι αποδεκτή τιμωρία για τα χειρότερα εγκλήματα.", de: "Die Todesstrafe ist eine akzeptable Strafe für die schlimmsten Verbrechen." }, econ: 0.5,  auth: 2    },
  { q: { en: "Freedom of speech should be protected even for offensive views.", el: "Η ελευθερία λόγου πρέπει να προστατεύεται ακόμη και για προκλητικές απόψεις.", de: "Die Redefreiheit sollte auch für anstößige Meinungen geschützt sein." }, econ: 0,    auth: -2   },
  { q: { en: "A universal basic income would improve society.", el: "Ένα καθολικό βασικό εισόδημα θα βελτίωνε την κοινωνία.", de: "Ein bedingungsloses Grundeinkommen würde die Gesellschaft verbessern." }, econ: -1.5, auth: -1   },
  { q: { en: "Foreign aid is a waste of taxpayer money.", el: "Η εξωτερική βοήθεια είναι σπατάλη των χρημάτων των φορολογούμενων.", de: "Auslandshilfe ist eine Verschwendung von Steuergeldern." }, econ: 1.5,  auth: 1    },
  { q: { en: "The state should control the media to maintain order.", el: "Το κράτος πρέπει να ελέγχει τα μέσα ενημέρωσης για να διατηρήσει την τάξη.", de: "Der Staat sollte die Medien kontrollieren, um Ordnung zu wahren." }, econ: 0.5,  auth: 2.5  },
  { q: { en: "Workers should have a say in how companies are run.", el: "Οι εργαζόμενοι πρέπει να έχουν λόγο στο πώς λειτουργούν οι εταιρείες.", de: "Arbeiter sollten mitentscheiden dürfen, wie Unternehmen geführt werden." }, econ: -2,   auth: -0.5 },
  { q: { en: "National borders should be strictly enforced.", el: "Τα εθνικά σύνορα πρέπει να επιβάλλονται αυστηρά.", de: "Nationale Grenzen sollten streng durchgesetzt werden." }, econ: 1,    auth: 2    },
  { q: { en: "Private charity is more effective than government welfare.", el: "Η ιδιωτική φιλανθρωπία είναι πιο αποτελεσματική από την κρατική πρόνοια.", de: "Private Wohltätigkeit ist wirksamer als staatliche Wohlfahrt." }, econ: 2,    auth: -1   },
];

const ANSWERS = [
  { label: { en: "Strongly disagree", el: "Ασυμφωνώ έντονα", de: "Stimme überhaupt nicht zu" }, value: -2, sym: "xx", cls: "disagree-strong" },
  { label: { en: "Disagree",          el: "Ασυμφωνώ",          de: "Stimme nicht zu" },             value: -1, sym: "x",  cls: "disagree" },
  { label: { en: "Agree",             el: "Συμφωνώ",           de: "Stimme zu" },                   value:  1, sym: "check", cls: "agree" },
  { label: { en: "Strongly agree",    el: "Συμφωνώ έντονα",    de: "Stimme völlig zu" },            value:  2, sym: "checkcheck", cls: "agree-strong" },
];

/* Inline SVG marks — no emoji, no icon font. */
const ICONS = {
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  xx: `<svg viewBox="0 0 26 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M2 5l8 8-8 8M14 5l8 8-8 8"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5.5 5.5L20 6"/></svg>`,
  checkcheck: `<svg viewBox="0 0 30 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12.5l5 5L15 7M13 16.5l4 4L28 8"/></svg>`,
};

/* Figures: approximate compass coordinates + short blurbs (localized).
   Names stay in English; photos are Wikimedia Commons thumbnails. */
const FIGURES = [
  { name: "Karl Marx",           years: "1818–1883 · philosopher",              econ: -9.2, auth: 3.5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Karl_Marx_by_John_Jabez_Edwin_Mayall_1875_-_Restored.png/500px-Karl_Marx_by_John_Jabez_Edwin_Mayall_1875_-_Restored.png",
    blurb: { en: "Argued that capitalism exploits labor and that class struggle drives history, envisioning a stateless, collective society.", el: "Υποστήριξε ότι ο καπιταλισμός εκμεταλλεύεται την εργασία και ότι η ταξική πάλη οδηγεί την ιστορία, φανταζόμενος μια κοινωνία χωρίς κράτος και συλλογική.", de: "Argumentierte, dass Kapitalismus Arbeit ausbeutet und Klassenkampf die Geschichte antreibt; er stellte sich eine staatenlose, kollektive Gesellschaft vor." } },
  { name: "Vladimir Lenin",      years: "1870–1924 · revolutionary",            econ: -8.5, auth: 8,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Lenin_in_1920_%28cropped%29.jpg/500px-Lenin_in_1920_%28cropped%29.jpg",
    blurb: { en: "Led the Bolshevik Revolution and built a one-party state in the name of the working class.", el: "Ηγήθηκε της Οκτωβριανής Επανάστασης και έχτισε ένα κράτος ενός κόμματος εξ ονόματος της εργατικής τάξης.", de: "Führte die Oktoberrevolution und baute einen Einparteienstaat im Namen der Arbeiterklasse." } },
  { name: "Noam Chomsky",        years: "1928– · linguist &amp; thinker",       econ: -8,   auth: -7.5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Noam_Chomsky_portrait_2017_retouched.jpg/500px-Noam_Chomsky_portrait_2017_retouched.jpg",
    blurb: { en: "Criticizes corporate power and state intervention alike, advocating grassroots democracy and free speech absolutism.", el: "Κριτικάρει τόσο την εταιρική δύναμη όσο και την κρατική παρέμβαση, υποστηρίζοντας τη δημοκρατία της βάσης και την απόλυτη ελευθερία λόγου.", de: "Kritisiert sowohl unternehmerische Macht als auch staatliches Eingreifen und setzt sich für Basisdemokratie und uneingeschränkte Redefreiheit ein." } },
  { name: "Bernie Sanders",      years: "1941– · US senator",                   econ: -6,   auth: -3,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Bernie_Sanders_February_2026_%28cropped%29.jpg/500px-Bernie_Sanders_February_2026_%28cropped%29.jpg",
    blurb: { en: "Democratic socialist who campaigns for universal healthcare, workers' rights, and curbing corporate influence.", el: "Δημοκρατικός σοσιαλιστής που εκστρατεύει για καθολική υγειονομική περίθαλψη, δικαιώματα εργαζομένων και περιορισμό της εταιρικής επιρροής.", de: "Demokratischer Sozialist, der für allgemeine Gesundheitsversorgung, Arbeitsrechte und die Eindämmung des Unternehmeneinflusses wirbt." } },
  { name: "Martin Luther King Jr.", years: "1929–1968 · civil rights leader",   econ: -6,   auth: -4,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Martin_Luther_King%2C_Jr._and_Lyndon_Johnson_%28cropped%29.jpg/500px-Martin_Luther_King%2C_Jr._and_Lyndon_Johnson_%28cropped%29.jpg",
    blurb: { en: "Fought racial segregation through nonviolent resistance, linking civil rights to economic justice.", el: "Αγωνίστηκε ενάντια στον φυλετικό χωρισμό μέσω μη βίαιης αντίστασης, συνδέοντας τα ατομικά δικαιώματα με την οικονομική δικαιοσύνη.", de: "Kämpfte durch gewaltlosen Widerstand gegen rassische Trennung und verknüpfte Bürgerrechte mit wirtschaftlicher Gerechtigkeit." } },
  { name: "Nelson Mandela",      years: "1918–2013 · president of South Africa", econ: -4.5, auth: -2.5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/500px-Nelson_Mandela_1994.jpg",
    blurb: { en: "Anti-apartheid icon who became South Africa's first Black president, emphasizing reconciliation over revenge.", el: "Εικόνα του αντι-απαρτάιντ που έγινε ο πρώτος μαύρος πρόεδρος της Νότιας Αφρικής, με έμφαση στη συμφιλίωση αντί για το χρέος.", de: "Anti-Apartheid-Ikone, die Südafrikas erster schwarzer Präsident wurde und Versöhnung über Rache stellte." } },
  { name: "Mahatma Gandhi",      years: "1869–1948 · independence leader",      econ: -4,   auth: -5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/500px-Mahatma-Gandhi%2C_studio%2C_1931.jpg",
    blurb: { en: "Pioneered nonviolent civil disobedience, combining self-reliance and simplicity with fierce anti-colonialism.", el: "Πρωτοπόρησε τη μη βίαιη απείθεια, συνδυάζοντας την αυτάρκεια και την απλότητα με έντονο αντιαποικιακό πνεύμα.", de: "Begründete den gewaltlosen zivilen Ungehorsam und verband Eigenständigkeit und Einfachheit mit vehementem Antikolonialismus." } },
  { name: "Franklin D. Roosevelt", years: "1882–1945 · US president",           econ: -4,   auth: 1.5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/FDR-1944-Campaign-Portrait_%283x4_retouched%2C_cropped%29.jpg/500px-FDR-1944-Campaign-Portrait_%283x4_retouched%2C_cropped%29.jpg",
    blurb: { en: "Expanded the federal government's role in the economy through the New Deal and led the US through most of WWII.", el: "Διεύρυνε τον ρόλο της ομοσπονδιακής κυβέρνησης στην οικονομία μέσω του New Deal και ηγήθηκε των ΗΠΑ στον Β' Παγκόσμιο Πόλεμο.", de: "Erweiterte die Rolle der Bundesregierung in der Wirtschaft durch den New Deal und führte die USA durch den Großteil des Zweiten Weltkriegs." } },
  { name: "Barack Obama",        years: "1961– · US president",                 econ: -2.5, auth: -1.5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/500px-President_Barack_Obama.jpg",
    blurb: { en: "Centrist progressive who expanded healthcare access and favored diplomacy and social liberalism.", el: "Κεντρώος προοδευτικός που διεύρυνε την πρόσβαση στην υγειονομική περίθαλψη και υποστήριξε τη διπλωματία και τον κοινωνικό φιλελευθερισμό.", de: "Zentristischer Progressiver, der den Zugang zur Gesundheitsversorgung ausweitete und Diplomatie sowie Sozialliberalismus bevorzugte." } },
  { name: "Hillary Clinton",     years: "1947– · US politician",                econ: -0.5, auth: -0.5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Former_United_States_Secretary_of_State_Hillary_Rodham_Clinton_at_the_U.S._Department_of_State_on_September_26%2C_2023_in_Washington%2C_D.C._14_%28cropped%29.jpg/500px-Former_United_States_Secretary_of_State_Hillary_Rodham_Clinton_at_the_U.S._Department_of_State_on_September_26%2C_2023_in_Washington%2C_D.C._14_%28cropped%29.jpg",
    blurb: { en: "Moderate Democrat supporting a regulated market economy with a strong national security posture.", el: "Διαλλακτική Δημοκρατική που υποστηρίζει μια ρυθμιζόμενη αγοραϊκή οικονομία με ισχυρή εθνική ασφάλεια.", de: "Moderate Demokratin, die eine regulierte Marktwirtschaft mit starker nationaler Sicherheit unterstützt." } },
  { name: "Angela Merkel",       years: "1954– · German chancellor",            econ: 1,    auth: 0.5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Angela_Merkel_2019_cropped.jpg/500px-Angela_Merkel_2019_cropped.jpg",
    blurb: { en: "Pragmatic center-right leader of a social-market economy, blending free trade with a strong welfare state.", el: "Πραγματιστικήγηγεμόνια δεξιού κέντρου μιας κοινωνικής αγοραϊκής οικονομίας, συνδυάζοντας το ελεύθερο εμπόριο με ένα ισχυρό κράτος ευημερίας.", de: "Pragmatische Mitte-rechts-Führerin einer sozialen Marktwirtschaft, die Freihandel mit einem starken Sozialstaat verbindet." } },
  { name: "Winston Churchill",   years: "1874–1965 · British prime minister",   econ: 3,    auth: 2.5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Sir_Winston_Churchill_-_19086236948_%28restored%29.jpg/500px-Sir_Winston_Churchill_-_19086236948_%28restored%29.jpg",
    blurb: { en: "Wartime leader who defended liberal democracy abroad while opposing collectivism at home.", el: "Ηγέτης του πολέμου που υπερασπίστηκε τη φιλελεύθερη δημοκρατία στο εξωτερικό ενώ αντιτάχθηκε στον συλλογισμό στην πατρίδα.", de: "Kriegsführer, der liberale Demokratie im Ausland verteidigte und Kollektivismus im Inland ablehnte." } },
  { name: "Margaret Thatcher",   years: "1925–1993 · British prime minister",   econ: 6,    auth: 2.5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Margaret_Thatcher_stock_portrait_%28cropped%29.jpg/500px-Margaret_Thatcher_stock_portrait_%28cropped%29.jpg",
    blurb: { en: "Privatized state industries, weakened unions, and championed free-market monetarism.", el: "Ιδιοποίησε κρατικές βιομηχανίες, αδυνάμισε τα συνδικάτα και προώθησε τον νομισματικό ελευθεριακό δημοκρατισμό.", de: "Privatisierte Staatsindustrien, schwächte Gewerkschaften und förderte freimarktwirtschaftlichen Monetarismus." } },
  { name: "Ronald Reagan",       years: "1911–2004 · US president",             econ: 6.5,  auth: 3,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Official_Portrait_of_President_Reagan_1981.jpg/500px-Official_Portrait_of_President_Reagan_1981.jpg",
    blurb: { en: "Cut taxes and regulation, promoted supply-side economics, and took a hard line against the Soviet Union.", el: "Μείωσε τους φόρους και τη ρύθμιση, προώθησε την οικονομία της προσφοράς και υιοθέτησε σκληρή γραμμή απέναντι στη Σοβιετική Ένωση.", de: "Senkte Steuern und Regulierung, förderte Angebotsökonomie und vertrat eine harte Linie gegen die Sowjetunion." } },
  { name: "Milton Friedman",     years: "1912–2006 · economist",                econ: 8,    auth: -1,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Portrait_of_Milton_Friedman_%284x5_cropped%29.jpg/500px-Portrait_of_Milton_Friedman_%284x5_cropped%29.jpg",
    blurb: { en: "Nobel-winning economist who argued for free markets, floating currencies, and school choice.", el: "Νοβελίστας οικονομολόγος που υποστήριξε τις ελεύθερες αγορές, τα ελεύθερα συναλλάγματα και την επιλογή σχολείου.", de: "Nobel-preisgekrönter Ökonom, der sich für freie Märkte, flexible Wechselkurse und Schulwahl aussprach." } },
  { name: "Ron Paul",            years: "1935– · US politician",                econ: 5.5,  auth: -6,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Ron_Paul_2023_%283x4_cropped%29.jpg/500px-Ron_Paul_2023_%283x4_cropped%29.jpg",
    blurb: { en: "Libertarian-leaning congressman who opposed the Fed, foreign intervention, and most government spending.", el: "Βουλευτής με ελευθεριακές τάσεις που αντιτάχθηκε στη Federal Reserve, στην εξωτερική παρέμβαση και στις περισσότερες κρατικές δαπάνες.", de: "Libertärer Abgeordneter, der sich gegen die Fed, ausländische Interventionen und die meisten staatlichen Ausgaben wandte." } },
  { name: "Ayn Rand",            years: "1905–1982 · writer &amp; thinker",     econ: 9,    auth: -5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Ayn_Rand_%281943_Talbot_portrait%29.jpg/500px-Ayn_Rand_%281943_Talbot_portrait%29.jpg",
    blurb: { en: "Created Objectivism: rational self-interest, laissez-faire capitalism, and fierce opposition to altruism as coercion.", el: "Δημιούργησε τον Αντικειμενισμό: λογικός εγωισμός, καπιταλισμός αφεθειμένος στην τύχη και έντονη αντίθεση στον αλληλέντον ως βία.", de: "Schuf den Objektivismus: rationaler Eigennutz, Laissez-faire-Kapitalismus und heftige Ablehnung von Altruismus als Zwang." } },
  { name: "Donald Trump",        years: "1946– · US president",                 econ: 5.5,  auth: 6,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Official_Presidential_Portrait_of_President_Donald_J._Trump_%282025%29.jpg/500px-Official_Presidential_Portrait_of_President_Donald_J._Trump_%282025%29.jpg",
    blurb: { en: "Nationalist conservative combining tax cuts and deregulation with protectionism and strong border enforcement.", el: "Εθνικιστής συντηρητικός που συνδυάζει μειώσεις φόρων και απορρύθμιση με προστατευτισμό και αυστηρή επιβολή των συνόρων.", de: "Nationaler Konservativer, der Steuersenkungen und Deregulierung mit Protektionismus und strenger Grenzdurchsetzung verbindet." } },
  { name: "Alexis Tsipras",      years: "1974– · Greek prime minister",         econ: -4,   auth: 1,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Alexis_Tsipras%2C_prime_minister_of_Greece_%28cropped%29.jpg/500px-Alexis_Tsipras%2C_prime_minister_of_Greece_%28cropped%29.jpg",
    blurb: { en: "Led Greece's left-wing Syriza into government, clashing with the EU over austerity and the terms of the country's bailouts.", el: "Ηγήθηκε του αριστερού ΣΥΡΙΖΑ στην κυβέρνηση, συγκρουόμενος με την ΕΕ για τη λιτότητα και τους όρους των δανείων της χώρας.", de: "Führte Griechenlands linke Syriza an die Regierung und prallte mit der EU über Austerität und die Kreditbedingungen des Landes zusammen." } },
  { name: "Nigel Farage",        years: "1964– · British politician",           econ: 3.5,  auth: 4,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Official_portrait_of_Nigel_Farage_MP_%283x4_cropped%29.jpg/500px-Official_portrait_of_Nigel_Farage_MP_%283x4_cropped%29.jpg",
    blurb: { en: "Right-populist campaigner who drove the Brexit movement and keeps the focus on immigration and EU scepticism.", el: "Δεξιός λαϊκιστής που οδήγησε το κίνημα του Brexit και επιμένει στη μετανάστευση και στην επιφύλαξη απέναντι στην ΕΕ.", de: "Rechter Populist, der die Brexit-Bewegung antrieb und den Fokus auf Immigration und EU-Skepsis hält." } },
  { name: "Jean-Luc Mélenchon",  years: "1951– · French politician",            econ: -6,   auth: -2,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Jean_Luc_M%C3%A9lenchon_en_mai_2026-_55261894422_%28cropped%29.jpg/500px-Jean_Luc_M%C3%A9lenchon_en_mai_2026-_55261894422_%28cropped%29.jpg",
    blurb: { en: "Far-left French firebrand calling for wealth taxes, public ownership, and a looser, fairer relationship with the EU.", el: "Αριστερός Γάλλος πυροβολιστής που ζητά φόρους πλούτου, δημόσια ιδιοκτησία και μια χαλαρότερη, δικαιότερη σχέση με την ΕΕ.", de: "Linker französischer Feuerwehrmann, der Vermögenssteuern, öffentliches Eigentum und eine lockerere, fairere Beziehung zur EU fordert." } },
  { name: "Jair Bolsonaro",      years: "1955– · Brazilian president",          econ: 4.5,  auth: 6,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Jair_Bolsonaro_em_24_de_abril_de_2019_%281%29_%283x4%29.jpg/500px-Jair_Bolsonaro_em_24_de_abril_de_2019_%281%29_%283x4%29.jpg",
    blurb: { en: "Brazil's former president: tough on crime, close to the churches, and openly hostile to environmental and social regulation.", el: "Πρώην πρόεδρος της Βραζιλίας: σκληρός απέναντι στο έγκλημα, κοντά στις εκκλησίες και ανοιχτά εχθρικός απέναντι στις περιβαλλοντικές και κοινωνικές ρυθμίσεις.", de: "Brasiliens Ex-Präsident: hart gegen Kriminalität, nah an den Kirchen und offen feindlich gegenüber Umwelt- und Sozialregulierung." } },
  { name: "Volodymyr Zelenskyy", years: "1978– · Ukrainian president",          econ: -1,   auth: 2,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Volodymyr_Zelensky_2022_official_portrait_%28cropped%29.jpg/500px-Volodymyr_Zelensky_2022_official_portrait_%28cropped%29.jpg",
    blurb: { en: "Ukraine's wartime president and former comedian who rallied international support against Russia's invasion.", el: "Ο πρόεδρος της Ουκρανίας σε πόλεμο και πρώην κωμικός που ενώνει τη διεθνή υποστήριξη ενάντια στη ρωσική εισβολή.", de: "Ukraines Kriegspräsident und ehemaliger Comedian, der internationale Unterstützung gegen die russische Invasion mobilisierte." } },
  { name: "Jacinda Ardern",      years: "1980– · New Zealand prime minister",  econ: -4,   auth: -3,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/New_Zealand_Prime_Minister_Jacinda_Ardern_in_2018.jpg/500px-New_Zealand_Prime_Minister_Jacinda_Ardern_in_2018.jpg",
    blurb: { en: "New Zealand's centre-left leader, known for empathy-led politics, child welfare, and swift gun-law reform after Christchurch.", el: "Η αριστερή ηγέτρια της Νέας Ζηλανδίας, γνωστή για την πολιτική της ενσυναίσθησης, τα παιδικά δικαιώματα και τη γρήγορη μεταρρύθμιση των νόμων περί όπλων.", de: "Neuseelands mitte-links Staatsführerin, bekannt für Empathie-Politik, Kinderwohl und schnelle Waffenrechtsreform nach Christchurch." } },
  { name: "Narendra Modi",       years: "1950– · Indian prime minister",       econ: 3,    auth: 5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Narendra_Modi_Portrait_2026.jpg/500px-Narendra_Modi_Portrait_2026.jpg",
    blurb: { en: "India's prime minister: Hindu-nationalist, business-friendly, and a commanding presence on the world stage.", el: "Ο πρωθυπουργός της Ινδίας: εθνικιστής του Ινδουισμού, φιλόχρηματος και κυρίαρχη φυσιογνωμία στη διεθνή σκηνή.", de: "Indiens Premierminister: hindu-nationalistisch, wirtschaftsfreundlich und eine dominante Figur auf der Weltbühne." } },
  { name: "Javier Milei",        years: "1970– · Argentine president",          econ: 7.5,  auth: -5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Javier_Milei_in_pull-aside_meeting_at_the_United_Nations_Headquarters_%283x4_cropped%29.jpg/500px-Javier_Milei_in_pull-aside_meeting_at_the_United_Nations_Headquarters_%283x4_cropped%29.jpg",
    blurb: { en: "Argentina's president: a self-described anarcho-capitalist who wants to slash the state, the central bank, and taxes.", el: "Ο πρόεδρος της Αργεντινής: αυτοπεριγραφόμενος αναρχοκαπιταλιστής που θέλει να μειώσει δραστικά το κράτος, την κεντρική τράπεζα και τους φόρους.", de: "Argentiniens Präsident: selbstbeschriebener Anarchokapitalist, der Staat, Zentralbank und Steuern radikal kürzen will." } },
  { name: "Nayib Bukele",        years: "1981– · Salvadoran president",         econ: 3.5,  auth: 6,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Presidente_Nayib_Bukele_%28cropped%29.jpg/500px-Presidente_Nayib_Bukele_%28cropped%29.jpg",
    blurb: { en: "El Salvador's president: a security-first strongman who used emergency powers to crush violent crime and governs with digital-age tools.", el: "Ο πρόεδρος του Ελ Σαλβαδόρ: ηγέτης με προτεραιότητα την ασφάλεια που χρησιμοποίησε εκτεταμένες εξουσίες για να νικήσει το βίαιο έγκλημα και κυβερνά με εργαλεία της ψηφιακής εποχής.", de: "El Salvadors Präsident: ein sicherheitsorientierter Stärkmann, der mit Notstandsbefugnissen die Gewaltkriminalität besiegte und im digitalen Zeitalter regiert." } },
  { name: "Geert Wilders",       years: "1963– · Dutch politician",             econ: 3,    auth: 4.5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Cumbre_de_Madrid_8_de_Febrero_-_54314677909_%28cropped%29.jpg/500px-Cumbre_de_Madrid_8_de_Febrero_-_54314677909_%28cropped%29.jpg",
    blurb: { en: "Dutch firebrand who campaigns to leave the EU, halt immigration, and slash Islam's role in public life.", el: "Ολλανδός πυροβολιστής που εκστρατεύει για έξοδο από την ΕΕ, σταμάτημα της μετανάστευσης και περιορισμό του ρόλου του Ισλάμ στη δημόσια ζωή.", de: "Niederländischer Feuerwehrmann, der für EU-Austritt, Stopp der Immigration und die Kürzung der Rolle des Islam im öffentlichen Leben wirbt." } },
  { name: "Emmanuel Macron",     years: "1977– · French president",             econ: 0.5,  auth: 0.5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Emmanuel_Macron_2025_%28cropped%29.jpg/500px-Emmanuel_Macron_2025_%28cropped%29.jpg",
    blurb: { en: "France's centrist president and former investment banker who built a liberal, pro-EU 'neither left nor right' movement.", el: "Ο κεντρώος πρόεδρος της Γαλλίας και πρώην τραπεζίτης που δημιούργησε ένα φιλελεύθερο, φιλο-ΕΕ κίνημα «ότι ούτε αριστερά ούτε δεξιά».", de: "Frankreichs zentristischer Präsident und ehemaliger Investmentbanker, der eine liberale, EU-freundliche „weder links noch rechte“ Bewegung gründete." } },
  { name: "Justin Trudeau",      years: "1971– · Canadian prime minister",      econ: -1,   auth: -1.5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Prime_Minister_Trudeau%27s_message_on_Christmas_2023_%280m29s%29_%28cropped%29.jpg/500px-Prime_Minister_Trudeau%27s_message_on_Christmas_2023_%280m29s%29_%28cropped%29.jpg",
    blurb: { en: "Canada's prime minister: a progressive, multicultural liberal who championed climate targets and legalised cannabis.", el: "Ο πρωθυπουργός του Καναδά: προοδευτικός, πολιτισμικά φιλελεύθερος που υποστήριξε στόχους για το κλίμα και νομιμοποίησε την κάνναβη.", de: "Kanadas Premierminister: ein progressiver, multikultureller Liberaler, der Klimaziele vertrat und Cannabis legalisierte." } },
];

/* Easter-egg match. When someone finishes the 30-question level by answering
   the first 15 "strongly agree" and the last 15 "strongly disagree", the result
   is always this figure and the flag is always Greece (see isStrifthsPattern).
   He is NOT part of the normal FIGURES pool — no photo, so the avatar shows "MS". */
const STRIFTHS = {
  name: "Marios Strifths",
  years: "· Greek political figure",
  econ: 0, auth: 0,
  img: "",
  blurb: {
    en: "A proudly Greek voice blending economic realism with a strong sense of national independence.",
    el: "Μια περήφανη ελληνική φωνή που συνδυάζει οικονομικό ρεαλισμό με ισχυρή εθνική ανεξαρτησία.",
    de: "Eine stolz griechische Stimme, die wirtschaftlichen Realismus mit starker nationaler Unabhängigkeit verbindet."
  },
};

const QUADRANTS = {
  center: { name: { en: "The Center", el: "Το Κέντρο", de: "Die Mitte" },
    desc: { en: "You resist tidy labels: interventionist on some issues, market-friendly on others, and wary of both rigid tradition and radical change. Pragmatism over ideology is your compass.", el: "Αντιστέκεστε στα καθαρά χαρακτηριστικά: παρεμβατική σε ορισμένα θέματα, φιλόστοργη σε άλλα, και διστακτική απέναντι στη σκληρή παράδοση και στη ριζική αλλαγή. Ο πραγματισμός αντί της ιδεολογίας είναι η πυξίδα σας.", de: "Du widerstehst klaren Etiketten: interventionistisch in manchen Fragen, marktfreundlich in anderen, und zurückhaltend gegenüber starrer Tradition wie radikalem Wandel. Pragmatismus statt Ideologie ist dein Kompass." } },
  tl: { name: { en: "Authoritarian Left", el: "Αυταρχική Αριστερά", de: "Autoritäre Linke" },
    desc: { en: "You believe collective action and an active state can correct economic injustice, and that social order sometimes requires strong authority. Think redistribution, public ownership, and a firm hand on stability.", el: "Πιστεύετε ότι η συλλογική δράση και ένο ενεργό κράτος μπορούν να διορθώσουν την οικονομική αδικία, και ότι η κοινωνική τάξη απαιτεί μερικές φορές ισχυρή εξουσία. Σκεφτείτε διανομή πλούτου, δημόσια ιδιοκτησία και αυστηρή σταθερότητα.", de: "Du glaubst, gemeinsames Handeln und ein aktiver Staat können wirtschaftliches Unrecht korrigieren, und dass soziale Ordnung manchmal starke Autorität verlangt. Denk an Umverteilung, öffentliches Eigentum und eine feste Hand bei der Stabilität." } },
  tr: { name: { en: "Authoritarian Right", el: "Αυταρχική Δεξιά", de: "Autoritäre Rechte" },
    desc: { en: "You favor free enterprise paired with strong traditional institutions, a capable military, and firm law-and-order policies. Markets yes — but within a framework of shared values.", el: "Υποστηρίζετε την ελεύθερη επιχειρηματικότητα σε συνδυασμό με ισχυρά παραδοσιακά θεσμικά όργανα, ένα ικανό στρατό και αυστηρές πολιτικές τάξης και νόμου. Αγορές ναι — αλλά μέσα σε ένα πλαίσιο κοινών αξιών.", de: "Du bevorzugst freies Unternehmertum gepaart mit starken traditionellen Institutionen, einer wehrhaften Armee und strengen Gesetz-und-Ordnung-Politiken. Märkte ja — aber im Rahmen geteilter Werte." } },
  bl: { name: { en: "Libertarian Left", el: "Ελεύθερη Αριστερά", de: "Libertäre Linke" },
    desc: { en: "You want economic solidarity and personal freedom: cooperation over profit, and government out of the bedroom. Decentralized power and social tolerance are your watchwords.", el: "Θέλετε κοινωνική αλληλεγγύη και προσωπική ελευθερία: συνεργασία αντί κέρδους, και κυβέρνηση έξω από το υπνοδωμάτιο. Αποκεντρωμένη εξουσία και κοινωνική ανοχή είναι οι συνθήματά σας.", de: "Du willst wirtschaftliche Solidarität und persönliche Freiheit: Zusammenarbeit statt Profit, und der Staat aus dem Schlafzimmer. Dezentrale Macht und soziale Toleranz sind deine Leitworte." } },
  br: { name: { en: "Libertarian Right", el: "Ελεύθερη Δεξιά", de: "Libertäre Rechte" },
    desc: { en: "You prize individual liberty and voluntary exchange above all, distrusting both state power and economic engineering. Minimum government, maximum choice.", el: "Εκτιμάτε την ατομική ελευθερία και την εθελοντική ανταλλαγή πάνω από όλα, εμπιστευόμενοι ούτε την κρατική εξουσία ούτε την οικονομική μηχανορράθμιση. Ελάχιστη κυβέρνηση, μέγιστη επιλογή.", de: "Du schätzt individuelle Freiheit und freiwilligen Austausch allem anderen vor und misstraust sowohl staatlicher Macht als auch ökonomischem Engineering. Minimaler Staat, maximale Wahl." } },
};

/* Countries: approximate mainstream position + a simple flag.
   `flag` = CSS background; `emblem` = optional inline SVG drawn on top. */
const COUNTRIES = [
  { name: { en: "Greece", el: "Ελλάδα", de: "Griechenland" }, econ: -0.5, auth: 1.5,
    blurb: { en: "Strong welfare state and labor protections paired with national pride and an established church.", el: "Ισχυρό κράτος ευημερίας και προστασία των εργαζομένων, με εθνική υπερηφάνεια και επίσημη εκκλησία.", de: "Starker Sozialstaat und Arbeitnehmerrechte gepaart mit Nationalstolz und einer Staatskirche." },
    flag: "#00549D",
    emblem: GREEK_FLAG_SVG },
  { name: { en: "United States", el: "Ηνωμένες Πολιτείες", de: "Vereinigte Staaten" }, econ: 3.5, auth: 3,
    blurb: { en: "Free-market capitalism, strong military, and deep constitutional individualism.", el: "Καπιταλισμός ελεύθερης αγοράς, ισχυρός στρατός και βαθιά συνταγματική ατομικότητα.", de: "Kapitalismus der freien Markt, starke Militärmacht und tiefer verfassungsmäßiger Individualismus." },
    flag: "repeating-linear-gradient(180deg,#b22234 0 7.7%,#fff 7.7% 15.4%)",
    emblem: `<svg viewBox="0 0 40 40"><rect width="18" height="16" fill="#3c3b6e"/></svg>` },
  { name: { en: "United Kingdom", el: "Ηνωμένο Βασίλειο", de: "Vereinigtes Königreich" }, econ: 2, auth: 2,
    blurb: { en: "Mixed economy with a strong union tradition, constitutional monarchy, and pragmatic centrism.", el: "Μεικτή οικονομία με ισχυρή συνδικατική παράδοση, συνταγματική μοναρχία και πραγματιστικό κέντρο.", de: "Gemischte Wirtschaft mit starker Gewerkschaftstradition, konstitutioneller Monarchie und pragmatischem Zentrismus." },
    flag: "#012169",
    emblem: `<svg viewBox="0 0 40 40"><path d="M0 0 L40 40 M40 0 L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0 L40 40 M40 0 L0 40" stroke="#C8102E" stroke-width="3"/><path d="M20 0 V40 M0 20 H40" stroke="#fff" stroke-width="13"/><path d="M20 0 V40 M0 20 H40" stroke="#C8102E" stroke-width="7"/></svg>` },
  { name: { en: "Sweden", el: "Σουηδία", de: "Schweden" }, econ: -4.5, auth: -2,
    blurb: { en: "Generous universal welfare funded by high taxes, with strong personal freedoms.", el: "Γενναιόδωρη καθολική ευημερία με υψηλούς φόρους, με ισχυρές προσωπικές ελευθερίες.", de: "Großzügiger allgemeiner Sozialstaat, finanziert durch hohe Steuern, mit starken persönlichen Freiheiten." },
    flag: "#006aa7", emblem: `<svg viewBox="0 0 40 40"><rect x="12" width="7" height="40" fill="#fecc00"/><rect y="16" width="40" height="7" fill="#fecc00"/></svg>` },
  { name: { en: "Norway", el: "Νορβηγία", de: "Norwegen" }, econ: -4, auth: -1.5,
    blurb: { en: "Oil-funded social democracy with comprehensive services and high trust in government.", el: "Κοινωνική δημοκρατία χρηματοδοτούμενη από το πετρέλαιο, με ολοκληρωμένες υπηρεσίες και υψηλή εμπιστοσύνη στη κυβέρνηση.", de: "Ölfinanzierte Sozialdemokratie mit umfassenden Dienstleistungen und hohem Vertrauen in die Regierung." },
    flag: "#ba0c2f", emblem: `<svg viewBox="0 0 40 40"><rect x="11" width="9" height="40" fill="#fff"/><rect y="15" width="40" height="9" fill="#fff"/><rect x="13" width="5" height="40" fill="#00205b"/><rect y="17" width="40" height="5" fill="#00205b"/></svg>` },
  { name: { en: "Denmark", el: "Δανία", de: "Dänemark" }, econ: -3.5, auth: -2.5,
    blurb: { en: "Flexicurity model: easy hiring and firing wrapped in a thick safety net.", el: "Μοντέλο flexicurity: εύκολη πρόσληψη και απόλυση μέσα σε ένα πυκνό δίκτυο ασφαλίσης.", de: "Flexicurity-Modell: leichte Einstellung und Entlassung, eingebettet in ein dichtes Sicherheitsnetz." },
    flag: "#c60c30", emblem: `<svg viewBox="0 0 40 40"><rect x="12" width="6" height="40" fill="#fff"/><rect y="17" width="40" height="6" fill="#fff"/></svg>` },
  { name: { en: "Finland", el: "Φινλανδία", de: "Finnland" }, econ: -3.5, auth: -2,
    blurb: { en: "Equalitarian society with free education and healthcare, low corruption.", el: "Ισότιμη κοινωνία με δωρεάν εκπαίδευση και υγειονομική περίθαλψη, χαμηλή διαφθορά.", de: "Egalitäre Gesellschaft mit freier Bildung und Gesundheitsversorgung, geringer Korruption." },
    flag: "#fff", emblem: `<svg viewBox="0 0 40 40"><rect x="12" width="6" height="40" fill="#003580"/><rect y="17" width="40" height="6" fill="#003580"/></svg>` },
  { name: { en: "France", el: "Γαλλία", de: "Frankreich" }, econ: -1.5, auth: 0.5,
    blurb: { en: "Dirigist state, strong protections for workers, and a fierce secular republicanism.", el: "Κράτος κατεύθυνσης, ισχυρή προστασία των εργαζομένων και έντονο κοσμικό δημοκρατισμό.", de: "Dirigistischer Staat, starke Arbeitnehmerrechte und vehementer säkularer Republikanismus." },
    flag: "linear-gradient(90deg,#002395 33.3%,#fff 33.3% 66.6%,#ED2939 66.6%)" },
  { name: { en: "Germany", el: "Γερμανία", de: "Deutschland" }, econ: -0.5, auth: 1,
    blurb: { en: "Social market economy balancing export industry, co-determination, and fiscal restraint.", el: "Κοινωνική αγοραϊκή οικονομία που ισορροπεί μεταξύ εξαγωγικής βιομηχανίας, συμμετοχής και δημοσιονομικής συγκράτησης.", de: "Soziale Marktwirtschaft, die Exportindustrie, Mitbestimmung und fiskalische Zurückhaltung in Balance hält." },
    flag: "linear-gradient(180deg,#000 33.3%,#DD0000 33.3% 66.6%,#FFCE00 66.6%)" },
  { name: { en: "Italy", el: "Ιταλία", de: "Italien" }, econ: 0.5, auth: 1.5,
    blurb: { en: "Mixed economy with strong regional identities, big industry, and lively party politics.", el: "Μεικτή οικονομία με ισχυρές περιφερειακές ταυτότητες, μεγάλη βιομηχανία και ζωντανή κομματική πολιτική.", de: "Gemischte Wirtschaft mit starken regionalen Identitäten, großer Industrie und lebhafter Parteipolitik." },
    flag: "linear-gradient(90deg,#009246 33.3%,#fff 33.3% 66.6%,#CE2B37 66.6%)" },
  { name: { en: "Spain", el: "Ισπανία", de: "Spanien" }, econ: -1, auth: 0,
    blurb: { en: "Social-market economy rebuilt after Franco, with strong regional autonomy.", el: "Κοινωνική αγοραϊκή οικονομία που ξαναχτίστηκε μετά τον Φράνκο, με ισχυρή περιφερειακή αυτονομία.", de: "Soziale Marktwirtschaft, die nach Franco neu aufgebaut wurde, mit starker regionaler Autonomie." },
    flag: "linear-gradient(180deg,#AA151B 25%,#F1BF00 25% 75%,#AA151B 75%)" },
  { name: { en: "Poland", el: "Πολωνία", de: "Polen" }, econ: 0.5, auth: 3,
    blurb: { en: "Market reforms meets strong Catholic tradition and conservative social policy.", el: "Αγοραϊκές μεταρρυθμίσεις σε συνδυασμό με ισχυρή καθολική παράδοση και συντηρητική κοινωνική πολιτική.", de: "Marktreformen treffen auf starke katholische Tradition und konservative Sozialpolitik." },
    flag: "linear-gradient(180deg,#fff 50%,#DC143C 50%)" },
  { name: { en: "Hungary", el: "Ουγγαρία", de: "Ungarn" }, econ: 1, auth: 4.5,
    blurb: { en: "National-conservative model mixing welfare with tight control of institutions.", el: "Εθνικοσυντηρητικό μοντέλο που συνδυάζει την ευημερία με αυστηρό έλεγχο των θεσμών.", de: "Nationalkonservatives Modell, das Sozialstaat mit strenger Kontrolle der Institutionen verbindet." },
    flag: "linear-gradient(180deg,#CE2A3E 33.3%,#fff 33.3% 66.6%,#436F4D 66.6%)" },
  { name: { en: "Turkey", el: "Τουρκία", de: "Türkei" }, econ: 1.5, auth: 5,
    blurb: { en: "State-guided market with a strong presidential role and nationalist politics.", el: "Αγορά με κρατική καθοδήγηση, ισχυρός προεδρικός ρόλος και εθνικιστική πολιτική.", de: "Staatlich gelenkter Markt mit starker Präsidentschaft und nationalistischer Politik." },
    flag: "#E30A17", emblem: `<svg viewBox="0 0 40 40"><circle cx="17" cy="20" r="9" fill="#fff"/><circle cx="20" cy="20" r="7.2" fill="#E30A17"/><path d="M28 20l6.5-2.1-4 5.6v-7l4 5.6z" fill="#fff"/></svg>` },
  { name: { en: "Russia", el: "Ρωσία", de: "Russland" }, econ: 2, auth: 8,
    blurb: { en: "State-capitalist economy under tight political control and nationalist ideology.", el: "Κρατοκαπιταλιστική οικονομία υπό αυστηρό πολιτικό έλεγχο και εθνικιστική ιδεολογία.", de: "Staatskapitalistische Wirtschaft unter strenger politischer Kontrolle und nationalistischer Ideologie." },
    flag: "linear-gradient(180deg,#fff 33.3%,#0039A6 33.3% 66.6%,#D52B1E 66.6%)" },
  { name: { en: "China", el: "Κίνα", de: "China" }, econ: -3, auth: 9.5,
    blurb: { en: "Command economy blended with markets, governed by a single-party state.", el: "Οικονομία εντολής σε συνδυασμό με αγορές, διοικούμενη από κράτος ενός κόμματος.", de: "Kommandowirtschaft, verbunden mit Märkten, regiert von einem Einparteienstaat." },
    flag: "#DE2910", emblem: `<svg viewBox="0 0 40 40"><path d="M12 8l1.8 5.5H19l-4.5 3.3 1.7 5.4-4.2-3.4-4.2 3.4 1.7-5.4L5 13.5h5.2z" fill="#FFDE00"/></svg>` },
  { name: { en: "Cuba", el: "Κούβα", de: "Kuba" }, econ: -8, auth: 7.5,
    blurb: { en: "One-party socialist state with central planning and limited private enterprise.", el: "Σοσιαλιστικό κράτος ενός κόμματος με κεντρικό σχεδιασμό και περιορισμένη ιδιωτική πρωτοβουλία.", de: "Sozialistischer Einparteienstaat mit Zentralplanung und begrenzter privater Initiative." },
    flag: "linear-gradient(180deg,#002A8F 20%,#fff 20% 40%,#002A8F 40% 60%,#fff 60% 80%,#002A8F 80%)",
    emblem: `<svg viewBox="0 0 40 40"><path d="M0 0 L18 20 L0 40 Z" fill="#CF142B"/></svg>` },
  { name: { en: "Venezuela", el: "Βενεζουέλα", de: "Venezuela" }, econ: -6, auth: 5.5,
    blurb: { en: "Socialist-oriented state built on oil wealth and extensive price controls.", el: "Κράτος με σοσιαλιστικές τάσεις, χτισμένο πάνω σε πετρελαιοπλούτο και εκτεταμένο έλεγχο τιμών.", de: "Sozialistisch ausgerichteter Staat, aufgebaut auf Ölreichtum und umfassender Preis­kontrolle." },
    flag: "linear-gradient(180deg,#FFCC00 33.3%,#00247D 33.3% 66.6%,#CF142B 66.6%)" },
  { name: { en: "North Korea", el: "Βόρεια Κορέα", de: "Nordkorea" }, econ: -9, auth: 10,
    blurb: { en: "Total centrally-planned economy under absolute single-family rule.", el: "Πλήρως κεντρικά σχεδιασμένη οικονομία υπό απόλυτη κυριαρχία μιας οικογένειας.", de: "Vollständig zentral geplante Wirtschaft unter absoluter Herrschaft einer einzigen Familie." },
    flag: "linear-gradient(180deg,#024FA2 25%,#fff 25% 33%,#ED1C24 33% 67%,#fff 67% 75%,#024FA2 75%)",
    emblem: `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="6" fill="#fff"/><circle cx="20" cy="20" r="4.6" fill="#ED1C24"/></svg>` },
  { name: { en: "Japan", el: "Ιαπωνία", de: "Japan" }, econ: 2, auth: 1,
    blurb: { en: "Coordinated market economy with strong industry groups and a conservative consensus.", el: "Συντονισμένη αγοραϊκή οικονομία με ισχυρές βιομηχανικές ομάδες και συντηρητική συναίνεση.", de: "Koordinierte Marktwirtschaft mit starken Industriegruppen und konsensfähigem Konsens." },
    flag: "#fff", emblem: `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="9" fill="#BC002D"/></svg>` },
  { name: { en: "India", el: "Ινδία", de: "Indien" }, econ: 0, auth: 2.5,
    blurb: { en: "Diverse federal democracy mixing socialism, markets, and religious tradition.", el: "Πολυσύνθετη ομοσπονδιακή δημοκρατία που συνδυάζει σοσιαλισμό, αγορές και θρησκευτική παράδοση.", de: "Vielfältige föderale Demokratie, die Sozialismus, Märkte und religiöse Tradition verbindet." },
    flag: "linear-gradient(180deg,#FF9933 33.3%,#fff 33.3% 66.6%,#138808 66.6%)",
    emblem: `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="5" fill="none" stroke="#000080" stroke-width="1.6"/></svg>` },
  { name: { en: "Brazil", el: "Βραζιλία", de: "Brasilien" }, econ: 1, auth: 2,
    blurb: { en: "Big mixed economy with extensive social programs and a federal republic.", el: "Μεγάλη μεικτή οικονομία με εκτεταμένα κοινωνικά προγράμματα και ομοσπονδιακή δημοκρατία.", de: "Große gemischte Wirtschaft mit umfassenden Sozialprogrammen und einer föderalen Republik." },
    flag: "#009B3A", emblem: `<svg viewBox="0 0 40 40"><path d="M20 6 L34 20 L20 34 L6 20 Z" fill="#FEDF00"/><circle cx="20" cy="20" r="6" fill="#002776"/></svg>` },
  { name: { en: "Israel", el: "Ισραήλ", de: "Israel" }, econ: 2.5, auth: 3.5,
    blurb: { en: "Free-market economy with a strong security state and coalition politics.", el: "Οικονομία ελεύθερης αγοράς με ισχυρό κράτος ασφαλείας και κομματική πολιτική.", de: "Freiwirtschaftliche Wirtschaft mit einem starken Sicherheitsstaat und Koalitionspolitik." },
    flag: "#fff", emblem: `<svg viewBox="0 0 40 40"><rect y="7" width="40" height="3" fill="#0038b8"/><rect y="30" width="40" height="3" fill="#0038b8"/><path d="M20 13l7 12H13z" fill="none" stroke="#0038b8" stroke-width="1.6"/><path d="M20 27l-7-12h14z" fill="none" stroke="#0038b8" stroke-width="1.6"/></svg>` },
  { name: { en: "Saudi Arabia", el: "Σαουδική Αραβία", de: "Saudi-Arabien" }, econ: 4, auth: 9,
    blurb: { en: "Oil-based economy under absolute monarchy guided by religious law.", el: "Οικονομία βασισμένη στο πετρέλαιο υπό απόλυτη μοναρχία με θρησκευτικό δίκαιο.", de: "Ölbasierte Wirtschaft unter absoluter Monarchie, geführt nach religiösem Recht." },
    flag: "#006C35", emblem: `<svg viewBox="0 0 40 40"><rect x="9" y="17" width="22" height="2" fill="#fff"/><rect x="9" y="23" width="16" height="1.6" fill="#fff"/></svg>` },
  { name: { en: "Iran", el: "Ιράν", de: "Iran" }, econ: 0.5, auth: 9.5,
    blurb: { en: "State-heavy economy directed by a theocratic government.", el: "Οικονομία με μεγάλο κρατικό ρόλο, κατευθυνόμενη από θεοκρατική κυβέρνηση.", de: "Staatlastige Wirtschaft, die von einer theokratischen Regierung gelenkt wird." },
    flag: "linear-gradient(180deg,#239F40 33.3%,#fff 33.3% 66.6%,#DA0000 66.6%)",
    emblem: `<svg viewBox="0 0 40 40"><path d="M14 20a6 6 0 0 1 12 0" fill="none" stroke="#DA0000" stroke-width="2"/></svg>` },
  { name: { en: "Australia", el: "Αυστραλία", de: "Australien" }, econ: 1.5, auth: 1,
    blurb: { en: "Market economy with a universal healthcare and superannuation safety net.", el: "Αγοραϊκή οικονομία με καθολική υγειονομική περίθαλψη και δίκτυο ασφάλισης.", de: "Marktwirtschaft mit allgemeiner Gesundheitsversorgung und Alterssicherungsnetz." },
    flag: "#00008B", emblem: `<svg viewBox="0 0 40 40"><path d="M9 9l1 3h3l-2.4 1.9.9 3-2.5-1.9-2.5 1.9.9-3L5 12h3z" fill="#fff"/></svg>` },
  { name: { en: "Switzerland", el: "Ελβετία", de: "Schweiz" }, econ: 4, auth: -3,
    blurb: { en: "Low-tax market economy with direct democracy and armed neutrality.", el: "Αγοραϊκή οικονομία χαμηλών φόρων με άμεση δημοκρατία και οπλισμένη ουδετερότητα.", de: "Niedrigsteuer-Marktwirtschaft mit direkter Demokratie und bewaffneter Neutralität." },
    flag: "#D52B1E", emblem: `<svg viewBox="0 0 40 40"><rect x="17" y="9" width="6" height="22" fill="#fff"/><rect x="9" y="17" width="22" height="6" fill="#fff"/></svg>` },
  { name: { en: "Canada", el: "Καναδάς", de: "Kanada" }, econ: -1, auth: -1,
    blurb: { en: "Mixed economy with universal healthcare, multiculturalism, and monarchy.", el: "Μεικτή οικονομία με καθολική υγειονομική περίθαλψη, πολιτισμικό πλουραλισμό και μοναρχία.", de: "Gemischte Wirtschaft mit allgemeiner Gesundheitsversorgung, Multikulturalismus und Monarchie." },
    flag: "linear-gradient(90deg,#FF0000 25%,#fff 25% 75%,#FF0000 75%)" },
  { name: { en: "New Zealand", el: "Νέα Ζηλανδία", de: "Neuseeland" }, econ: 0, auth: -2,
    blurb: { en: "Social-market economy with strong welfare, workers' rights, and nuclear-free policy.", el: "Κοινωνική αγοραϊκή οικονομία με ισχυρή ευημερία, δικαιώματα εργαζομένων και πολιτική χωρίς πυρηνικά.", de: "Soziale Marktwirtschaft mit starkem Sozialstaat, Arbeitsrechten und atomwaffenfreier Politik." },
    flag: "#00247D", emblem: `<svg viewBox="0 0 40 40"><circle cx="30" cy="12" r="2" fill="#fff"/><circle cx="28" cy="24" r="2" fill="#fff"/><circle cx="34" cy="20" r="1.4" fill="#fff"/></svg>` },
];

/* Ideologies: approximate compass positions + plain-language explanations (localized). */
const IDEOLOGIES = [
  { name: { en: "Communism", el: "Κομμουνισμός", de: "Kommunismus" }, econ: -9, auth: 6,
    desc: { en: "Abolish private ownership of production; the means of production are held collectively, ideally leading to a classless, stateless society. In practice, historically implemented as a one-party state controlling the economy.", el: "Κατάργηση της ιδιωτικής ιδιοκτησίας στην παραγωγή· τα μέσα παραγωγής ανήκουν συλλογικά, οδηγώντας ιδανικά σε μια κοινωνία χωρίς τάξεις και χωρίς κράτος. Στη πράξη, ιστορικά εφαρμόστηκε ως κράτος ενός κόμματος που ελέγχει την οικονομία.", de: "Abschaffung des privaten Eigentums an Produktionsmitteln; die Produktionsmittel gehören gemeinsam und führen idealer zu einer klassen- und staatenlosen Gesellschaft. In der Praxis historisch als Einparteienstaat umgesetzt, der die Wirtschaft kontrolliert." } },
  { name: { en: "Socialism", el: "Σοσιαλισμός", de: "Sozialismus" }, econ: -6, auth: 2,
    desc: { en: "Social or collective ownership of key industries and a strong welfare state, while usually (but not always) keeping democratic politics and some markets.", el: "Κοινωνική ή συλλογική ιδιοκτησία βασικών βιομηχανιών και ένα ισχυρό κράτος ευημερίας, συνήθως (αν και όχι πάντα) με δημοκρατική πολιτική και κάποιες αγορές.", de: "Gesellschaftliches oder gemeinsames Eigentum an Schlüsselindustrien und ein starker Sozialstaat, meist (aber nicht immer) mit demokratischer Politik und einigen Märkten." } },
  { name: { en: "Democratic Socialism", el: "Δημοκρατικός Σοσιαλισμός", de: "Demokratischer Sozialismus" }, econ: -5.5, auth: -1.5,
    desc: { en: "Achieve socialist economic goals — public services, worker power — through democratic elections rather than revolution, keeping civil liberties intact.", el: "Επίτευξη σοσιαλιστικών οικονομικών στόχων — δημόσιες υπηρεσίες, δύναμη των εργαζομένων — μέσω δημοκρατικών εκλογών αντί για επανάσταση, διατηρώντας ανέπαφα τα ατομικά δικαιώματα.", de: "Sozialistische Wirtschaftsziele — öffentliche Dienste, Macht der Arbeitnehmer — durch demokratische Wahlen statt Revolution erreichen und die bürgerlichen Freiheiten bewahren." } },
  { name: { en: "Social Democracy", el: "Κοινωνική Δημοκρατία", de: "Sozialdemokratie" }, econ: -3.5, auth: -0.5,
    desc: { en: "Keep capitalism but soften it heavily: high taxes funding universal healthcare, education, and safety nets, with strong regulation and labor rights.", el: "Διατήρηση του καπιταλισμού αλλά με σημαντική μαλάκωση: υψηλοί φόροι που χρηματοδοτούν καθολική υγειονομική περίθαλψη, εκπαίδευση και δίκτυα ασφαλίσης, με ισχυρή ρύθμιση και δικαιώματα εργαζομένων.", de: "Den Kapitalismus behalten, aber stark abmildern: hohe Steuern finanzieren allgemeine Gesundheitsversorgung, Bildung und Sicherheitsnetze, mit starker Regulierung und Arbeitsrechten." } },
  { name: { en: "Progressivism", el: "Προοδευτισμός", de: "Progressivismus" }, econ: -2.5, auth: -1,
    desc: { en: "Reform-oriented left-liberalism: government action on inequality and climate, plus expanding personal freedoms and civil rights.", el: "Μεταρρυθμιστικός αριστερός φιλελευθερισμός: κρατική δράση ενάντια στην ανισότητα και στην κλιματική αλλαγή, και διεύρυνση των προσωπικών ελευθεριών και των ατομικών δικαιωμάτων.", de: "Reformorientierter Linksliberalismus: staatliches Handeln gegen Ungleichheit und Klimawandel sowie Erweiterung persönlicher Freiheiten und Bürgerrechte." } },
  { name: { en: "Liberalism", el: "Φιλελευθερισμός", de: "Liberalismus" }, econ: -0.5, auth: -1.5,
    desc: { en: "Centrist defense of individual rights, democratic government, and regulated free markets, balancing equality with personal liberty.", el: "Κεντρώα υπεράσπιση των ατομικών δικαιωμάτων, της δημοκρατικής κυβέρνησης και των ρυθμιζόμενων ελεύθερων αγορών, ισορροπώντας την ισότητα με την προσωπική ελευθερία.", de: "Zentristische Verteidigung individueller Rechte, demokratischer Regierung und regulierter freier Märkte, die Gleichheit mit persönlicher Freiheit in Balance hält." } },
  { name: { en: "Centrism", el: "Κεντρισμός", de: "Zentrismus" }, econ: 0, auth: 0,
    desc: { en: "Pragmatic mix drawn from both sides; wary of ideology, favoring evidence over left or right dogma.", el: "Πραγματιστικός μείκτης από τις δύο πλευρές· διστακτικός απέναντι στην ιδεολογία, με προτίμηση στην τεκμηρίωση αντί για αριστερή ή δεξιά δόγματα.", de: "Pragmatische Mischung aus beiden Lagern; ideologieweidrig, mit Vorliebe für Evidenz statt linker oder rechter Dogmen." } },
  { name: { en: "Conservatism", el: "Συντηρητισμός", de: "Konservatismus" }, econ: 2, auth: 2.5,
    desc: { en: "Free markets paired with traditional institutions, gradual rather than rapid change, and emphasis on order, family, and nation.", el: "Ελεύθερες αγορές σε συνδυασμό με παραδοσιακά θεσμικά όργανα, σταδιακή αντί ριζικής αλλαγής, και έμφαση στην τάξη, την οικογένεια και το έθνος.", de: "Freie Märkte gepaart mit traditionellen Institutionen, schrittweise statt raschem Wandel und Betonung von Ordnung, Familie und Nation." } },
  { name: { en: "Nationalism", el: "Εθνικισμός", de: "Nationalismus" }, econ: 1.5, auth: 5,
    desc: { en: "Prioritizes the nation-state, strong borders, and cultural unity; willing to use state power to defend national identity and industry.", el: "Δίνει προτεραιότητα στο έθνο-κράτος, στα ισχυρά σύνορα και στην πολιτική ενότητα· διατεθειμένο να χρησιμοποιεί την κρατική εξουσία για να υπερασπίσει την εθνική ταυτότητα και τη βιομηχανία.", de: "Priorisiert den Nationalstaat, starke Grenzen und kulturelle Einheit; bereit, staatliche Macht einzusetzen, um nationale Identität und Industrie zu schützen." } },
  { name: { en: "Libertarianism", el: "Ελευθεριαρχισμός", de: "Libertarismus" }, econ: 4.5, auth: -5,
    desc: { en: "Maximize individual liberty and minimal government; free markets, voluntary association, and wide personal freedom with few restrictions.", el: "Μεγιστοποίηση της ατομικής ελευθερίας και ελάχιστη κυβέρνηση· ελεύθερες αγορές, εθελοντική οργάνωση και εκτεταμένη προσωπική ελευθερία με ελάχιστους περιορισμούς.", de: "Individuelle Freiheit maximieren und die Regierung minimieren; freie Märkte, freiwillige Vereinigung und weitgehende persönliche Freiheit mit wenigen Beschränkungen." } },
  { name: { en: "Anarchism", el: "Αναρχισμός", de: "Anarchismus" }, econ: -6, auth: -9,
    desc: { en: "Reject the state and hierarchy entirely; envision a society run by voluntary, self-managed cooperation and mutual aid.", el: "Απόρριψη του κράτους και της ιεραρχίας εντελώς· φαντάζεται μια κοινωνία που λειτουργεί με εθελοντική, αυτοδιαχειριζόμενη συνεργασία και αλληλεπικοινωνία.", de: "Staat und Hierarchie vollständig ablehnen; eine Gesellschaft, die auf freiwilliger, selbstverwalteter Zusammenarbeit und gegenseitiger Hilfe läuft." } },
  { name: { en: "Fascism", el: "Φασισμός", de: "Faschismus" }, econ: 3.5, auth: 9.5,
    desc: { en: "Ultra-nationalist, authoritarian ideology subordinating the individual to the nation, led by a strong leader, with state-directed economy and suppressed dissent.", el: "Υπερεθνικιστική, αυταρχική ιδεολογία που υποτάσσει το άτομο στο έθνος, ηγούμενη από έναν ισχυρό ηγέτη, με κρατικά κατευθυνόμενη οικονομία και καταστολή της διαφωνίας.", de: "Ultranationalistische, autoritäre Ideologie, die das Individuum der Nation unterordnet, geführt von einem starken Führer, mit staatlich gelenkter Wirtschaft und unterdrückter Dissens." } },
  { name: { en: "Monarchism", el: "Μοναρχισμός", de: "Monarchismus" }, econ: 2.5, auth: 6,
    desc: { en: "Government led by a hereditary monarch; authority derives from tradition and dynasty rather than popular mandate alone.", el: "Κυβέρνηση από έναν κληρονομικό μονάρχη· η εξουσία προέρχεται από την παράδοση και τη δυναστεία παρά από τη λαϊκή εντολή μόνο.", de: "Regierung durch einen erblichen Monarchen; Autorität stammt aus Tradition und Dynastie statt allein aus dem Volksauftrag." } },
  { name: { en: "Theocracy", el: "Θεοκρατία", de: "Theokratie" }, econ: 2, auth: 9,
    desc: { en: "Government based on religious law and authority, where spiritual doctrine shapes the state and its rules.", el: "Κυβέρνηση βασισμένη στο θρησκευτικό δίκαιο και την εξουσία, όπου η πνευματική διδασκαλία διαμορφώνει το κράτος και τους κανόνες του.", de: "Regierung auf Basis religiösen Rechts und Autorität, wo geistliche Lehre Staat und seine Regeln formt." } },
];

/* Glossary: hard words in questions → plain-language tooltip.
   `words` lists the exact surface forms per language (matched against that
   language's questions); `def` is the localized definition. */
const GLOSSARY = {
  taxation: {
    def: { en: "Money the government requires people and businesses to pay.", el: "Χρήματα που το κράτος απαιτεί από ανθρώπους και επιχειρήσεις να πληρώνουν.", de: "Geld, das die Regierung von Menschen und Unternehmen verlangt." },
    words: { en: ["taxation", "taxes"], el: ["φορολόγηση", "φορολόγησης"], de: ["Steuern", "Steuer"] },
  },
  inequality: {
    def: { en: "An unfair or unequal distribution of wealth or opportunity.", el: "Αδικημένη ή ανίση κατανομή πλούτου ή ευκαιρίας.", de: "Eine unfaire oder ungleiche Verteilung von Wohlstand oder Chancen." },
    words: { en: ["inequality"], el: ["ανισότητας", "ανισότητα"], de: ["Ungleichheit"] },
  },
  market: {
    def: { en: "The system of buying and selling goods and services.", el: "Το σύστημα αγοράς και πώλησης αγαθών και υπηρεσιών.", de: "Das System des Kaufs und Verkaufs von Waren und Dienstleistungen." },
    words: { en: ["market", "markets"], el: ["αγορά", "αγοράς"], de: ["Markt", "Märkte"] },
  },
  regulate: {
    def: { en: "To control an activity by rules set by a government.", el: "Να ελέγχεται μια δραστηριότητα με κανόνες που θέτει η κυβέρνηση.", de: "Eine Tätigkeit durch von der Regierung gesetzte Regeln steuern." },
    words: { en: ["regulate", "regulation", "regulated", "regulating"], el: ["ρυθμίζει", "ρύθμιση"], de: ["regulieren", "Regulierung"] },
  },
  union: {
    def: { en: "An organization of workers that bargains with employers over pay and conditions.", el: "Οργάνωση εργαζομένων που διαπραγματεύεται με τους εργοδότες για μισθούς και συνθήκες.", de: "Eine Organisation von Arbeitnehmern, die mit Arbeitgebern über Löhne und Bedingungen verhandelt." },
    words: { en: ["unions", "union"], el: ["συνδικάτες", "συνδικάτου"], de: ["Gewerkschaften", "Gewerkschaft"] },
  },
  traditionalValues: {
    def: { en: "Long-established beliefs and customs, often about family and religion.", el: "Παλαιές πεποιθήσεις και έθιμα, συχνά για την οικογένεια και τη θρησκεία.", de: "Lange etablierte Überzeugungen und Bräuche, oft über Familie und Religion." },
    words: { en: ["traditional values"], el: ["παραδοσιακές αξίες"], de: ["Traditionelle Werte"] },
  },
  decriminalize: {
    def: { en: "To stop treating an act as a crime, though it may still be regulated.", el: "Να σταματήσει η μεταχείριση μιας πράξης ως εγκλήματος, αν και μπορεί ακόμη να ρυθμίζεται.", de: "Aufhören, eine Handlung als Verbrechen zu behandeln, auch wenn sie weiterhin reguliert werden kann." },
    words: { en: ["decriminalized", "decriminalize"], el: ["αποποινικοποιηθεί"], de: ["entkriminalisiert"] },
  },
  military: {
    def: { en: "A country's armed forces.", el: "Οι ένοπλες δυνάμεις μιας χώρας.", de: "Die Streitkräfte eines Landes." },
    words: { en: ["military"], el: ["στρατό", "στρατού"], de: ["Militärmacht", "Militär"] },
  },
  immigration: {
    def: { en: "People moving to a country to live there permanently.", el: "Άνθρωποι που μετακομίζουν σε μια χώρα για να ζήσουν μόνιμα εκεί.", de: "Menschen, die in ein Land ziehen, um dort dauerhaft zu leben." },
    words: { en: ["immigration"], el: ["μετανάστευση"], de: ["Einwanderung"] },
  },
};

