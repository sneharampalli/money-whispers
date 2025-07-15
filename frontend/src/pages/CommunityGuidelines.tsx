import React from 'react';

const CommunityGuidelines = () => {
    return (
        <div className='communityGuidelinesPage'>
            <div className="container">
                <h1 className="communityGuidelinesHeader">Community Guidelines</h1>
                <p> 
                    Welcome to Money Whispers! This is a safe, anonymous space to share your money questions, stories, and advice without judgment. To ensure a positive experience for everyone, please keep the following guidelines in mind:
                </p>
                <div className="communityGuidelinesContent">
                    <ol>
                        <li>
                            <span className="communityGuidelinesTitle">Embrace the Judgment-Free Zone</span>
                            <br/>
                            Be supportive, not critical: We're all here to learn and share. Refrain from shaming, lecturing, or putting down others' financial situations or choices.
                            Understand different perspectives: Everyone's money journey is unique. What works for one person might not work for another, and that's okay.
                            Focus on encouragement: Offer constructive advice and empathetic responses.
                        </li>
                        <li>
                            <span className="communityGuidelinesTitle">Honesty is Key (Even Anonymously)</span>
                            <br/>
                            Share your truth: Whether it's a struggle or a success, your genuine experiences are valuable.
                            Be authentic: While you're anonymous, please don't intentionally mislead others or spread false information.
                            Disclose when necessary: If you're sharing advice based on personal experience, it's helpful (though not required) to give context.
                        </li>
                        <li>
                            <span className="communityGuidelinesTitle">Cultivate Curiosity and Learning</span>
                            <br/>
                            Ask away: No question is too basic or too complex. If you're wondering, chances are someone else is too.
                            Engage thoughtfully: Read posts with an open mind and ask clarifying questions if something isn't clear.
                            Share your knowledge: If you have advice or insights, offer them respectfully.
                        </li>
                        <li>
                            <span className="communityGuidelinesTitle">Respect Anonymity</span>
                            <br/>
                            Protect yourself and others: Do not share any personally identifiable information about yourself or anyone else. This includes names, specific addresses, phone numbers, email addresses, or other data that could compromise anonymity.
                            Do not attempt to unmask users: Respect the anonymous nature of the platform.
                            Keep it general: When sharing stories, focus on the financial aspects and avoid details that could inadvertently identify individuals.
                        </li>
                        <li>
                            <span className="communityGuidelinesTitle">Keep it Respectful (and Feel Free to Add Humor!)</span>
                            <br/>
                            No hate speech or harassment: This includes discriminatory remarks, threats, or personal attacks of any kind.
                            Avoid spam and self-promotion: This platform is for genuine discussion, not advertising or soliciting.
                            Humor is welcome: Financial topics can be stressful, so lightheartedness and appropriate humor are encouraged, as long as they don't violate other guidelines.
                            Stay on topic: Keep discussions focused on money-related themes.
                        </li>
                    </ol>
                </div>
                <p>
                    Violations of these guidelines may result in content removal or, in severe cases, a ban from the platform.
                    We're excited to have you as part of the Money Whispers community! What kind of money whispers are you looking forward to hearing or sharing?
                </p>    
            </div>
        </div>
    );
}

export default CommunityGuidelines;