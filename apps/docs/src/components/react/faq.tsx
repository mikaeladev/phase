import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/accordion"
import { Link } from "~/components/react/link.tsx"

const railwayLink = <Link href="https://railway.app">Railway</Link>

const discordLink = (
  <Link href="https://phasebot.xyz/redirect/discord">Discord</Link>
)

const kofiLink = <Link href="https://phasebot.xyz/redirect/ko-fi">Ko-fi</Link>

const buymeacoffeeLink = (
  <Link href="https://phasebot.xyz/redirect/buymeacoffee">Buy Me a Coffee</Link>
)

export function FAQ() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>How is Phase free?</AccordionTrigger>
        <AccordionContent>
          The bot is hosted on {railwayLink}, which has a very generous Hobby
          tier, so keeping it free is as simple as keeping it cheap to run. The
          code is optimised for running on low resources, so it doesn't cost
          much.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Will there ever be a paid version?</AccordionTrigger>
        <AccordionContent>Nope.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I self-host a Phase instance?</AccordionTrigger>
        <AccordionContent>
          Right now, no, but very soon. Once it's ready, there'll be detailed
          guides on how to self-host.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Can I contribute to the code?</AccordionTrigger>
        <AccordionContent>
          Yes! If you need any help, feel free to reach out for a breakdown of
          how it all works.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger>How do I request a feature?</AccordionTrigger>
        <AccordionContent>Just ask me in my {discordLink}!</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-6">
        <AccordionTrigger>
          How do I give you all the money in my bank account?
        </AccordionTrigger>
        <AccordionContent>
          How kind of you! I have a {kofiLink} page, and a {buymeacoffeeLink}{" "}
          page. Donators get a sparkly role in my Discord. Give me money now
          please.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
