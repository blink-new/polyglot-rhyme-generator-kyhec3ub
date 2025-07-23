import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Loader2, Sparkles, Volume2, Languages, RotateCcw } from 'lucide-react'
import { blink } from '../blink/client'

interface RhymeResult {
  englishRhyme: string
  chileanPronunciation: string
  spanishTranslation: string
}

interface RhymeGeneratorProps {
  user: any
}

const RHYME_TYPES = [
  { value: 'limerick', label: 'Limerick' },
  { value: 'rap', label: 'Rap' },
  { value: 'haiku', label: 'Haiku' },
  { value: 'sorting-hat', label: 'Sorting Hat Song' }
]

const CONTENT_TYPES = [
  { value: 'high-frequency', label: 'High Frequency Vocabulary' },
  { value: 'context-specific', label: 'Context Specific Vocabulary' },
  { value: 'pronunciation', label: 'Pronunciation Practice' },
  { value: 'grammar', label: 'Grammar Focus' },
  { value: 'connectors', label: 'Connectors & Linking Words' },
  { value: 'level-based', label: 'CEFR Level Based' }
]

const GRAMMAR_TOPICS = [
  { value: 'present-simple', label: 'Present Simple' },
  { value: 'present-continuous', label: 'Present Continuous' },
  { value: 'past-simple', label: 'Past Simple' },
  { value: 'past-continuous', label: 'Past Continuous' },
  { value: 'present-perfect', label: 'Present Perfect' },
  { value: 'future-simple', label: 'Future Simple' },
  { value: 'conditionals', label: 'Conditionals' },
  { value: 'passive-voice', label: 'Passive Voice' },
  { value: 'modal-verbs', label: 'Modal Verbs' },
  { value: 'phrasal-verbs', label: 'Phrasal Verbs' },
  { value: 'prepositions', label: 'Prepositions' },
  { value: 'articles', label: 'Articles (a, an, the)' }
]

const CEFR_LEVELS = [
  { value: 'A1', label: 'A1 - Beginner' },
  { value: 'A2', label: 'A2 - Elementary' },
  { value: 'B1', label: 'B1 - Intermediate' },
  { value: 'B2', label: 'B2 - Upper Intermediate' },
  { value: 'C1', label: 'C1 - Advanced' },
  { value: 'C2', label: 'C2 - Proficient' }
]

const FLAVOURS = [
  { value: 'witty', label: 'Witty' },
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'profound', label: 'Profound' },
  { value: 'funny', label: 'Funny' }
]

export function RhymeGenerator({ user }: RhymeGeneratorProps) {
  const [rhymeType, setRhymeType] = useState('')
  const [contentType, setContentType] = useState('')
  const [context, setContext] = useState('')
  const [grammarTopic, setGrammarTopic] = useState('')
  const [cefrLevel, setCefrLevel] = useState('')
  const [flavour, setFlavour] = useState('')
  const [result, setResult] = useState<RhymeResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!rhymeType || !contentType) return

    setLoading(true)
    try {
      let prompt = `Generate a ${rhymeType} in English for language learners focusing on ${contentType.replace('-', ' ')}.`
      
      if (flavour) {
        prompt += ` The tone and style should be ${flavour}.`
      }
      
      if (contentType === 'context-specific' && context) {
        prompt += ` The context should be: ${context}.`
      }
      
      if (contentType === 'grammar' && grammarTopic) {
        prompt += ` Focus specifically on ${grammarTopic.replace('-', ' ')} grammar.`
      }
      
      if (contentType === 'level-based' && cefrLevel) {
        prompt += ` Adapt the vocabulary and complexity to ${cefrLevel} level.`
      }

      prompt += `

Please provide the output in exactly this format:

ENGLISH RHYME:
[The rhyme in English following the ${rhymeType} structure]

CHILEAN PRONUNCIATION:
[The same rhyme written phonetically for Chilean Spanish speakers to pronounce correctly, using Spanish phonetic approximations]

SPANISH TRANSLATION:
[A natural Spanish translation that maintains the meaning and educational value]`

      const { text } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 800
      })

      // Parse the response
      const sections = text.split(/(?:ENGLISH RHYME:|CHILEAN PRONUNCIATION:|SPANISH TRANSLATION:)/i)
      
      if (sections.length >= 4) {
        setResult({
          englishRhyme: sections[1]?.trim() || '',
          chileanPronunciation: sections[2]?.trim() || '',
          spanishTranslation: sections[3]?.trim() || ''
        })
      } else {
        // Fallback parsing if format is different
        setResult({
          englishRhyme: text,
          chileanPronunciation: 'Pronunciation guide will be generated in the next version.',
          spanishTranslation: 'Spanish translation will be generated in the next version.'
        })
      }
    } catch (error) {
      console.error('Error generating rhyme:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setRhymeType('')
    setContentType('')
    setContext('')
    setGrammarTopic('')
    setCefrLevel('')
    setFlavour('')
    setResult(null)
  }

  const canGenerate = rhymeType && contentType && 
    (contentType !== 'context-specific' || context) &&
    (contentType !== 'grammar' || grammarTopic) &&
    (contentType !== 'level-based' || cefrLevel)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇬🇧</span>
            <Languages className="h-6 w-6 text-primary" />
            <span className="text-2xl">🇨🇱</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Polyglot Rhyme Generator
        </h1>
        <p className="text-lg text-muted-foreground">
          Learn English through personalized rhymes with Chilean pronunciation guides
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Parameter Selection Panel */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Rhyme Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rhyme Type */}
            <div className="space-y-2">
              <Label htmlFor="rhyme-type">Rhyme Type</Label>
              <Select value={rhymeType} onValueChange={setRhymeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a rhyme type" />
                </SelectTrigger>
                <SelectContent>
                  {RHYME_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content Type */}
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Focus</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content focus" />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Flavour */}
            <div className="space-y-2">
              <Label htmlFor="flavour">Flavour</Label>
              <Select value={flavour} onValueChange={setFlavour}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone and style (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {FLAVOURS.map((flavourOption) => (
                    <SelectItem key={flavourOption.value} value={flavourOption.value}>
                      {flavourOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional Fields */}
            {contentType === 'context-specific' && (
              <div className="space-y-2">
                <Label htmlFor="context">Context</Label>
                <Input
                  id="context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g., restaurant, travel, business meeting"
                />
              </div>
            )}

            {contentType === 'grammar' && (
              <div className="space-y-2">
                <Label htmlFor="grammar-topic">Grammar Topic</Label>
                <Select value={grammarTopic} onValueChange={setGrammarTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grammar topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRAMMAR_TOPICS.map((topic) => (
                      <SelectItem key={topic.value} value={topic.value}>
                        {topic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {contentType === 'level-based' && (
              <div className="space-y-2">
                <Label htmlFor="cefr-level">CEFR Level</Label>
                <Select value={cefrLevel} onValueChange={setCefrLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    {CEFR_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleGenerate}
                disabled={!canGenerate || loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Rhyme
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={loading}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Display */}
        <div className="space-y-6">
          {result && (
            <>
              {/* English Rhyme */}
              <Card className="rhyme-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <span className="text-xl">🇬🇧</span>
                    English Rhyme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white/50 rounded-lg p-4 border">
                    <pre className="whitespace-pre-wrap font-medium text-foreground leading-relaxed">
                      {result.englishRhyme}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Chilean Pronunciation */}
              <Card className="rhyme-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent">
                    <Volume2 className="h-5 w-5" />
                    Chilean Pronunciation Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                    <pre className="whitespace-pre-wrap font-medium text-foreground leading-relaxed">
                      {result.chileanPronunciation}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Spanish Translation */}
              <Card className="rhyme-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <span className="text-xl">🇨🇱</span>
                    Spanish Translation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <pre className="whitespace-pre-wrap font-medium text-foreground leading-relaxed">
                      {result.spanishTranslation}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!result && !loading && (
            <Card className="border-dashed border-2 border-muted">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Ready to Generate Your Rhyme
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select your parameters and click "Generate Rhyme" to create a personalized learning experience
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}