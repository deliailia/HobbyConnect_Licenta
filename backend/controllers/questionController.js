const Questions = require('../models/Questions')

const addQuestion = async ( req, res) => {
    try{
      const { question, category, options, givenresp, statusq } = req.body;

        const newQuestion = new Questions({
            question,
            category,
            options,
            givenresp,
            statusq
        });

        await newQuestion.save();

        res.status(201).json({
            message: 'Qadded',
            question: newQuestion
        });
    }catch (error){
        console.error('Error adding question: ', error);
        res.status(500).json({
            message:'Error adding',
            error: error.message
        });
    }
};



const getQuestionById = async (req, res) => {
    const { id } = req.params;
    try {
      const question = await Questions.findById(id);
      if (!question) {
        return res.status(404).json({
          message: 'Question not found'
        });
      }
      res.status(200).json({
        question
      });
    } catch (error) {
      console.error('Error getting question:', error);
      res.status(500).json({
        message: 'Error getting question',
        error: error.message
      });
    }
  };

const getRandomQuestionByCategory = async(req, res) => {
  const { category } = req.params;
  try{
    const questions = await Questions.find({ category });
    if (!questions.length) {
      return res.status(404).json({ message: "No questions found in this category." });
    }

    res.status(200).json(questions);
  }catch (error) {
    console.error("Error fetching random question:", error);
    res.status(500).json({ error: "Error fetching random question." });
  }
}

module.exports={
    addQuestion,
    getQuestionById,
    getRandomQuestionByCategory
    
}