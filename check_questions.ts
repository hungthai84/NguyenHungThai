
import { hardcodedAnswers, questionGroups } from './lib/chat-data';

const viQuestions = questionGroups.vi.flatMap(g => g.questions);
const missingAnswers = viQuestions.filter(q => !hardcodedAnswers.vi[q.trim()]);

if (missingAnswers.length > 0) {
    console.log('Missing Vietnamese answers for:');
    missingAnswers.forEach(q => console.log(`- ${q}`));
} else {
    console.log('All Vietnamese questions have answers.');
}

const enQuestions = questionGroups.en.flatMap(g => g.questions);
const missingEnAnswers = enQuestions.filter(q => !hardcodedAnswers.en[q.trim()]);

if (missingEnAnswers.length > 0) {
    console.log('Missing English answers for:');
    missingEnAnswers.forEach(q => console.log(`- ${q}`));
} else {
    console.log('All English questions have answers.');
}
