import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ScrollFadeIn from '../components/ScrollFadeIn'
import BotIcon from '../components/BotIcon'

interface FaqItem {
  question: string
  answer: string
}

const faqSections: { title: string; items: FaqItem[] }[] = [
  {
    title: 'General',
    items: [
      {
        question: 'Why did Beyond Service change to WorkWave AMPLIFY?',
        answer: 'For years, our customer conference has been a place to learn, connect, and share ideas. As our customers have grown, we\'ve evolved too. The rebrand to AMPLIFY reflects our focus on helping attendees amplify their growth, impact, and results.',
      },
      {
        question: 'Who should attend the conference?',
        answer: 'Users of PestPac, RealGreen, or TEAM Software across all roles, from business owners and executives to operations leaders, office managers, and everyday users. Industries include pest control, lawn care, landscaping, commercial cleaning, and security.',
      },
      {
        question: 'Will the event be available virtually?',
        answer: 'Select sessions will be available on demand after the event, but we encourage you to attend in person to receive the full experience.',
      },
      {
        question: 'Do you accommodate dietary restrictions?',
        answer: 'Yes. Note your dietary needs during registration and the team will make accommodations.',
      },
      {
        question: 'Is this event accessible?',
        answer: 'Accessibility matters to us. Contact events@workwave.com with specific needs and we will assist you.',
      },
      {
        question: 'Who can I reach out to for additional information?',
        answer: 'Contact WorkWave Events at events@workwave.com for any questions, comments, or concerns.',
      },
    ],
  },
  {
    title: 'Sessions',
    items: [
      {
        question: 'Do you have a conference app?',
        answer: 'Yes. Download the event conference app (available December 2026) to view all sessions, build a personalized schedule, and view hotel floor maps.',
      },
      {
        question: 'Will sessions be segmented for each product or open to all?',
        answer: 'There are product-specific sessions for PestPac, RealGreen, and TEAM Software, but the conference also includes joint sessions on business operations, peer learning, AI trends, roadmap investments, and industry insights.',
      },
      {
        question: 'Can I attend a session outside of my software or industry track?',
        answer: 'All sessions offer value to every attendee, so you are welcome to attend sessions outside your product track. No pre-registration is required except for bootcamps and expert appointments.',
      },
      {
        question: 'What is a Product Bootcamp?',
        answer: 'Bootcamps are hands-on time with the software and are included in your ticket price. Bring your laptop and work with product experts using your own company data. Bootcamps require pre-registration.',
      },
      {
        question: 'What is the Meet the Product Experts area?',
        answer: 'This area offers 30-minute one-on-one sessions with experts covering reporting, feature demos, configuration help, and technical questions including APIs. Appointments go live in the conference app one week before the event.',
      },
    ],
  },
  {
    title: 'Events & Attire',
    items: [
      {
        question: 'Can I bring a guest or family member to nightly events?',
        answer: 'Plus One passes may be purchased during conference registration for $450. Each attendee is limited to one guest pass. Guest passes cover nightly events only (no daytime sessions, meals, or keynotes).',
      },
      {
        question: 'Are children permitted?',
        answer: 'All conference events are strictly 21 and over. No children are permitted at any conference events.',
      },
      {
        question: 'What is the dress code?',
        answer: 'Business casual. Slacks, casual suits, or jeans all work. Comfortable shoes and light layers are recommended.',
      },
    ],
  },
  {
    title: 'Hotel & Travel',
    items: [
      {
        question: 'Is there a discount for accommodations?',
        answer: 'The hotel block at the Hilton New Orleans Riverside is available until January 6, 2027. After that date, rates increase and rooms may sell out.',
      },
      {
        question: 'What is the weather like in New Orleans in February?',
        answer: 'Average highs are usually in the mid-60s Fahrenheit and lows can drop into the 40s. The humid climate can make it feel warmer or colder than expected. Bring an umbrella and layers.',
      },
      {
        question: 'Is the conference taking place during Mardi Gras?',
        answer: 'Yes, the conference occurs during Mardi Gras season. This creates an exciting atmosphere but also means street closures, parade traffic, and busy airports. Book flights and transfers earlier than usual.',
      },
      {
        question: 'How far is the hotel from the airport?',
        answer: 'The Hilton New Orleans Riverside is approximately 16 miles (about a 25 to 30 minute drive depending on traffic) from Louis Armstrong New Orleans International Airport (MSY).',
      },
    ],
  },
  {
    title: 'Registration',
    items: [
      {
        question: 'When is the last day to register?',
        answer: 'Registration closes on January 29, 2027. Secure your tickets by this date.',
      },
      {
        question: 'Are refunds available?',
        answer: 'Refunds will be granted in full until December 11, 2026. After this date, you may transfer your pass to a colleague or receive a credit for the next WorkWave Customer Conference.',
      },
      {
        question: 'Are name badges required?',
        answer: 'Name badges are required and must be worn for the entire conference, including nightly events. Badges are checked at all entry points. Reprints are not permitted.',
      },
      {
        question: 'Where and when can I pick up my badge?',
        answer: 'Registration and badge pick-up open on Sunday, January 31 at 8 AM at the Hilton New Orleans Riverside. Afternoon pickup is recommended to avoid the Monday morning rush.',
      },
      {
        question: 'Can I share my conference pass with a colleague?',
        answer: 'Conference passes are issued to a single individual and are non-transferable once the event begins. Badges are checked at all entry points.',
      },
    ],
  },
  {
    title: 'Partners',
    items: [
      {
        question: 'I am interested in exhibiting. Who can I contact?',
        answer: 'Contact Jerry Hsu at jerry.hsu@workwave.com for partnership information and exhibitor packages.',
      },
    ],
  },
]

function FaqAccordion({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-navy text-sm sm:text-base">{item.question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-5 pb-4">
          <p className="text-sm text-gray-500 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  )
}

function openChat() {
  window.dispatchEvent(new Event('open-chat'))
}

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  function toggle(key: string) {
    setOpenItems(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-2 font-display">Frequently Asked Questions</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Everything you need to know about WorkWave AMPLIFY 2027. Can't find your answer? Ask our conference assistant.
          </p>
        </div>

        {/* Chat bot nudge */}
        <ScrollFadeIn>
          <button
            onClick={openChat}
            className="w-full text-left bg-accent/5 border border-accent/20 rounded-xl p-5 mb-10 flex items-start gap-4 hover:bg-accent/10 hover:border-accent/30 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <BotIcon className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-navy text-sm mb-1">Got a question not listed here? Ask our AI assistant.</p>
              <p className="text-sm text-gray-500">
                It knows everything about AMPLIFY 2027, from sessions and tracks to travel tips and registration. Click here to start chatting.
              </p>
            </div>
          </button>
        </ScrollFadeIn>

        {faqSections.map((section) => (
          <ScrollFadeIn key={section.title}>
            <div className="mb-8">
              <h2 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-200">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => {
                  const key = `${section.title}-${item.question}`
                  return (
                    <FaqAccordion
                      key={key}
                      item={item}
                      isOpen={openItems.has(key)}
                      onToggle={() => toggle(key)}
                    />
                  )
                })}
              </div>
            </div>
          </ScrollFadeIn>
        ))}

        {/* Bottom chat nudge */}
        <ScrollFadeIn>
          <div className="text-center mt-12 p-8 bg-navy rounded-xl">
            <BotIcon className="w-10 h-10 text-accent mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg mb-2">Still have questions?</h3>
            <p className="text-gray-300 text-sm mb-4 max-w-md mx-auto">
              Our conference assistant is available 24/7. Ask about sessions, registration, travel, or anything else.
            </p>
            <button
              onClick={openChat}
              className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors mb-3"
            >
              Chat with our assistant
            </button>
            <p className="text-gray-500 text-xs">
              Or email <a href="mailto:events@workwave.com" className="text-accent hover:underline">events@workwave.com</a>
            </p>
          </div>
        </ScrollFadeIn>
      </div>
    </div>
  )
}
