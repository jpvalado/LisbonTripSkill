
  Summer Internship at Link Consulting | Skills development -  Amazon Akexa | Joao Rodrigues | July - September 2017


These are the results of my summer internship at Link Consulting. The objective of my work was to create a virtual assistant from available transit open data, General Transit Feed Specification - GTFS, that could be usable on a non-supported language. The chosen platform, Amazon’s Alexa, only supports English (United States and United Kingdom) and German, so as expected using it with Portuguese train stations was a challenge. Other objectives included getting acquainted with the capabilities and limitations of this virtual assistant, architectural models, session management and the business models that will drive these implementations.
From the first tests it was clear that presently Alexa had an hard time recognizing Portuguese names, getting less than 5% hit rate, so I’ve decided to try out the NATO Phonetic Alphabet on Alexa. This alphabet, first introduced in the military but now present in many other areas, is used to disambiguate letters over a voice communication channel. The results: over 95% hit rate, which I’d say is an interesting result for non-English speakers.
The chosen scenario exposes Lisbon public transportation operators timetables as a virtual assistant, allowing someone with an Amazon Echo to ask for the next train stops while having breakfast.


In Conclusion
This virtual assistants, although still recent, have great potential and applications, from answering trivial questions to more complex scenarios like shopping and home automation. The Alexa development environment proved very simple to use and without costs for the developer.
The lack of support for Portuguese language was successfully circumvented by using NATO Phonetic Alphabet, though is more likely for a British or an American to know such an alphabet than for a Portuguese.
Session management was simple to implement, though maintaining a conversation context over this session was somehow challenging as Alexa doesn’t provide native conversation support for it, leaving this responsibility to the developer.
Regarding business model Amazon is trying out a rewarding model for successful Skills to attract traffic to their ecosystem, so fill free to try your luck.
