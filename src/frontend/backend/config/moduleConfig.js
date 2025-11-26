module.exports = {
  cnee: {
    totalActivities: 3,
    activities: {
      cnee_trivia: {
        type: 'trivia',
        maxScore: 100,
        questions: 10
      },
      cnee_matching: {
        type: 'matching',
        maxScore: 100,
        pairs: 5
      },
      cnee_drag_drop: {
        type: 'drag_drop',
        maxScore: 100,
        items: 5
      }
    }
  },
  factura: {
    totalActivities: 3,
    activities: {
      bill_explorer: {
        type: 'interactive',
        maxScore: 100
      },
      concept_matching: {
        type: 'matching',
        maxScore: 100,
        pairs: 6
      },
      consumption_simulator: {
        type: 'interactive',
        maxScore: 100
      }
    }
  },
  alumbrado: {
    totalActivities: 3,
    activities: {
      element_drag_drop: {
        type: 'drag_drop',
        maxScore: 100,
        items: 5
      },
      responsibility_quiz: {
        type: 'trivia',
        maxScore: 100,
        questions: 8
      },
      entity_matching: {
        type: 'matching',
        maxScore: 100,
        pairs: 4
      }
    }
  },
  obligaciones: {
    totalActivities: 3,
    activities: {
      step_ordering: {
        type: 'drag_drop',
        maxScore: 100,
        items: 6
      },
      rights_trivia: {
        type: 'trivia',
        maxScore: 100,
        questions: 10
      },
      responsibility_matching: {
        type: 'matching',
        maxScore: 100,
        pairs: 5
      }
    }
  }
};
