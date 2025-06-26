const mongoose = require('mongoose');
const QuestionsMBTI = require('../models/QuestionsMBTI');  // adaptează calea



const questionsMBTI = [
  // Extraversion (E)
  {
    question: "Discovering and engaging with the world is one of my highest priorities.",
    tip: "E",
    category: "Extraversion vs Introversion"
  },
  {
    question: "I confidently take the lead in situations and make decisions decisively.",
    tip: "E",
    category: "Extraversion vs Introversion"
  },
  {
    question: "I firmly express my views and stand up for what I believe in.",
    tip: "E",
    category: "Extraversion vs Introversion"
  },
  {
    question: "Defending the people I care about is as important to me as advocating for myself.",
    tip: "E",
    category: "Extraversion vs Introversion"
  },
  {
    question: "I approach conflicts directly and am unafraid of confrontation.",
    tip: "E",
    category: "Extraversion vs Introversion"
  },
  {
    question: "I instinctively step into leadership roles when working in groups.",
    tip: "E",
    category: "Extraversion vs Introversion"
  },
  {
    question: "When I see injustice or unfairness, I feel compelled to take action and raise my voice.",
    tip: "E",
    category: "Extraversion vs Introversion"
  },
  {
    question: "I admire strength in others and am naturally attracted to assertive individuals.",
    tip: "E",
    category: "Extraversion vs Introversion"
  },
  {
    question: "I rely on myself and prefer to trust my own skills and capabilities.",
    tip: "E",
    category: "Extraversion vs Introversion"
  },
  {
    question: "I am at ease with wielding power to bring about meaningful change.",
    tip: "E",
    category: "Extraversion vs Introversion"
  },

  // Introversion (I)
  {
    question: "Having privacy and uninterrupted time for reflection is vital to me.",
    tip: "I",
    category: "Extraversion vs Introversion"
  },
  {
    question: "I prioritize exploring ideas and concepts over engaging in social interactions.",
    tip: "I",
    category: "Extraversion vs Introversion"
  },
  {
    question: "I remain alert to potential risks and consistently prepare contingency plans.",
    tip: "I",
    category: "Extraversion vs Introversion"
  },
  {
    question: "I value security and stability in both my surroundings and personal relationships.",
    tip: "I",
    category: "Extraversion vs Introversion"
  },
  {
    question: "I am deeply loyal and dedicated, particularly to those I place my trust in.",
    tip: "I",
    category: "Extraversion vs Introversion"
  },
  {
    question: "I carefully evaluate all potential outcomes and risks before making decisions.",
    tip: "I",
    category: "Extraversion vs Introversion"
  },
  {
    question: "Clear guidelines and expectations help me feel secure and confident in my role.",
    tip: "I",
    category: "Extraversion vs Introversion"
  },
  {
    question: "At times, I hesitate to act because of a fear of making the wrong decision.",
    tip: "I",
    category: "Extraversion vs Introversion"
  },
  {
    question: "I appreciate predictability and routine because they offer a sense of stability.",
    tip: "I",
    category: "Extraversion vs Introversion"
  },
  {
    question: "I frequently seek advice or reassurance from others before moving forward.",
    tip: "I",
    category: "Extraversion vs Introversion"
  },

  // Judging (J)
  {
    question: "I aim to be accurate and precise in everything I do.",
    tip: "J",
    category: "Judging vs Perceiving"
  },
  {
    question: "I am attentive to detail and quickly spot even minor errors or inconsistencies in my work.",
    tip: "J",
    category: "Judging vs Perceiving"
  },
  {
    question: "I consistently uphold high standards, even when working under pressure or tight deadlines.",
    tip: "J",
    category: "Judging vs Perceiving"
  },
  {
    question: "I routinely review my work to ensure it aligns with the expected quality and standards.",
    tip: "J",
    category: "Judging vs Perceiving"
  },
  {
    question: "I prioritize enhancing and optimizing systems and processes to increase efficiency and effectiveness.",
    tip: "J",
    category: "Judging vs Perceiving"
  },
  {
    question: "I tend to be self-critical and attentive to errors, both in my own work and in that of others.",
    tip: "J",
    category: "Judging vs Perceiving"
  },
  {
    question: "I place high importance on verifying every detail before finalizing a task.",
    tip: "J",
    category: "Judging vs Perceiving"
  },
  {
    question: "I frequently identify opportunities to refine and enhance processes, even those deemed efficient.",
    tip: "J",
    category: "Judging vs Perceiving"
  },
  {
    question: "I carefully analyze feedback, paying close attention to detail to guide my improvement.",
    tip: "J",
    category: "Judging vs Perceiving"
  },
  {
    question: "I maintain a structured and orderly workspace, where everything is intentionally placed.",
    tip: "J",
    category: "Judging vs Perceiving"
  },

  // Perceiving (P)
  {
    question: "I welcome change and adjust quickly to new circumstances.",
    tip: "P",
    category: "Judging vs Perceiving"
  },
  {
    question: "I frequently pursue new and exciting experiences to maintain a sense of interest in life.",
    tip: "P",
    category: "Judging vs Perceiving"
  },
  {
    question: "I view routine tasks as chances to discover creative ways to stay engaged.",
    tip: "P",
    category: "Judging vs Perceiving"
  },
  {
    question: "I tend to grow bored with the status quo and actively seek opportunities to innovate.",
    tip: "P",
    category: "Judging vs Perceiving"
  },
  {
    question: "Long-term planning feels limiting, as I prefer to embrace spontaneity.",
    tip: "P",
    category: "Judging vs Perceiving"
  },
  {
    question: "I tend to stay optimistic and often identify the positive side even in challenging situations.",
    tip: "P",
    category: "Judging vs Perceiving"
  },
  {
    question: "I excel in settings that offer freedom and the opportunity to make my own choices.",
    tip: "P",
    category: "Judging vs Perceiving"
  },
  {
    question: "I’m adept at quick thinking and adapting effectively to sudden changes.",
    tip: "P",
    category: "Judging vs Perceiving"
  },
  {
    question: "I find new ideas and projects more exciting than the actual execution or follow-up.",
    tip: "P",
    category: "Judging vs Perceiving"
  },
  {
    question: "I like to keep my options flexible instead of committing to a single path.",
    tip: "P",
    category: "Judging vs Perceiving"
  },

  // Feeling (F)
  {
    question: "I feel a deep responsibility to address inaccuracies in order to support and benefit others.",
    tip: "F",
    category: "Feeling vs Thinking"
  },
  {
    question: "Others frequently rely on me to identify and resolve errors.",
    tip: "F",
    category: "Feeling vs Thinking"
  },
  {
    question: "I have an intuitive awareness of when others are in need of emotional support.",
    tip: "F",
    category: "Feeling vs Thinking"
  },
  {
    question: "I offer help proactively, without expecting recognition or reward.",
    tip: "F",
    category: "Feeling vs Thinking"
  },
  {
    question: "Ensuring that others feel valued and cared for is central to how I build and maintain relationships.",
    tip: "F",
    category: "Feeling vs Thinking"
  },
  {
    question: "I naturally build and sustain close, meaningful relationships with others.",
    tip: "F",
    category: "Feeling vs Thinking"
  },
  {
    question: "I frequently prioritize the needs of others over my own.",
    tip: "F",
    category: "Feeling vs Thinking"
  },
  {
    question: "I openly express affection and care towards those around me.",
    tip: "F",
    category: "Feeling vs Thinking"
  },
  {
    question: "My happiness is deeply connected to the well-being of my loved ones.",
    tip: "F",
    category: "Feeling vs Thinking"
  },
  {
    question: "People often turn to me for comfort and guidance.",
    tip: "F",
    category: "Feeling vs Thinking"
  },

  // Thinking (T)
  
  {
    question: "I gather and evaluate data carefully to make well-informed decisions.",
    tip: "T",
    category: "Feeling vs Thinking"
  },
  {
    question: "I take pleasure in tackling complex problems through detailed analysis and research.",
    tip: "T",
    category: "Feeling vs Thinking"
  },
  {
    question: "I prefer to thoroughly examine an issue before sharing my insights.",
    tip: "T",
    category: "Feeling vs Thinking"
  },
  {
    question: "I maintain objectivity and detachment when analyzing situations or challenges.",
    tip: "T",
    category: "Feeling vs Thinking"
  },
  {
    question: "I frequently seek underlying principles and patterns to comprehend how things function.",
    tip: "T",
    category: "Feeling vs Thinking"
  },
  {
    question: "I define success through setting clear goals and accomplishing them.",
    tip: "T",
    category: "Feeling vs Thinking"
  },
  {
    question: "My ambition and desire for success fuel my motivation.",
    tip: "T",
    category: "Feeling vs Thinking"
  },
  {
    question: "I critically assess all possible outcomes before making a decision.",
    tip: "T",
    category: "Feeling vs Thinking"
  },
  {
    question: "I rely on facts and logic rather than feelings when solving problems.",
    tip: "T",
    category: "Feeling vs Thinking"
  },
  {
    question: "I enjoy debates that challenge my reasoning and help me refine my ideas.",
    tip: "T",
    category: "Feeling vs Thinking"
  },

  // Intuition (N)
  {
    question: "My emotional experiences frequently inspire and ignite my creativity.",
    tip: "N",
    category: "Sensing vs Intuition"
  },
  {
    question: "Expressing my individuality is essential in my work and artistic pursuits.",
    tip: "N",
    category: "Sensing vs Intuition"
  },
  {
    question: "I am naturally attracted to aesthetics and create environments filled with inspiring beauty.",
    tip: "N",
    category: "Sensing vs Intuition"
  },
  {
    question: "I feel truly alive when engaged in creating something innovative and unique.",
    tip: "N",
    category: "Sensing vs Intuition"
  },
  {
    question: "I tend to envision multiple future possibilities and opportunities.",
    tip: "N",
    category: "Sensing vs Intuition"
  },
  {
    question: "I find abstract concepts and theories fascinating and stimulating.",
    tip: "N",
    category: "Sensing vs Intuition"
  },
  {
    question: "I enjoy exploring ideas that challenge conventional thinking.",
    tip: "N",
    category: "Sensing vs Intuition"
  },
  {
    question: "I rely on intuition to guide my decisions and problem-solving.",
    tip: "N",
    category: "Sensing vs Intuition"
  },
  {
    question: "I am more interested in underlying meanings than just the surface details.",
    tip: "N",
    category: "Sensing vs Intuition"
  },
  {
    question: "I feel energized when discussing imaginative and theoretical topics.",
    tip: "N",
    category: "Sensing vs Intuition"
  },

  // Sensing (S)
  {
    question: "I tend to focus on practical details and facts rather than abstract ideas.",
    tip: "S",
    category: "Sensing vs Intuition"
  },
  {
    question: "I rely on my senses to understand and engage with the world around me.",
    tip: "S",
    category: "Sensing vs Intuition"
  },
  {
    question: "I appreciate traditions and proven methods that have stood the test of time.",
    tip: "S",
    category: "Sensing vs Intuition"
  },
  {
    question: "I prefer to deal with concrete realities rather than hypothetical possibilities.",
    tip: "S",
    category: "Sensing vs Intuition"
  },
  {
    question: "I value experiences that involve hands-on learning and practical application.",
    tip: "S",
    category: "Sensing vs Intuition"
  },
  {
    question: "I am detail-oriented and enjoy organizing information systematically.",
    tip: "S",
    category: "Sensing vs Intuition"
  },
  {
    question: "I trust past experiences to guide my current decisions and actions.",
    tip: "S",
    category: "Sensing vs Intuition"
  },
  {
    question: "I focus on what is present and real, rather than what could be imagined or predicted.",
    tip: "S",
    category: "Sensing vs Intuition"
  },
  {
    question: "I prefer step-by-step approaches rather than broad overviews or big-picture thinking.",
    tip: "S",
    category: "Sensing vs Intuition"
  },
  {
    question: "I am practical and realistic in my expectations and goals.",
    tip: "S",
    category: "Sensing vs Intuition"
  }
];

async function insertQuestions() {
  try {
    await mongoose.connect('mongodb://192.168.56.1:27017/HobbyConnectDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Șterge toate întrebările vechi
    await QuestionsMBTI.deleteMany({});
    console.log("Colecția QuestionsMBTI a fost golită.");

    // Inserează întrebările noi
    await QuestionsMBTI.insertMany(questionsMBTI);
    console.log("Întrebările au fost inserate cu succes.");

    await mongoose.disconnect();
    console.log("Deconectat de la baza de date.");
  } catch (error) {
    console.error("Eroare la inserarea întrebărilor:", error);
  }
}

insertQuestions();
module.exports = QuestionsMBTI;