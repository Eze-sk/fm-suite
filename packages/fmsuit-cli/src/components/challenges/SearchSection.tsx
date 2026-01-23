import { useEffect, useMemo, useState } from "react";

import { Box, Text, useInput } from "ink";
import { LoaderCard } from "@components/ui/Loaders";
import type { Status } from "@hooks/useInitialization";
import type { ChallengeData, ChallengeScrap } from "@typings/challengeData";

import { theme } from "@/colorPalette";

import ChallengeCardSearch from "./CardSearch";

interface Props {
  status: Status
  query: string
  data: ChallengeData | null
  onSelectResult: (c: ChallengeScrap | undefined) => void
  visibleItems?: number
}

export default function SearchSection({ status, query, data, onSelectResult, visibleItems = 3 }: Props): React.ReactNode {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const search = useMemo(() => {
    if (!query || query.trim() === "") {
      return data?.challenges ?? [];
    }

    const words = query.toLowerCase().split(/\s+/)

    const isTypingLastWord = !query.endsWith(" ");
    const lastWordIndex = words.length - 1;

    const tags: string[] = [];
    const searchTerms: string[] = [];

    words.forEach((word, index) => {
      if (word.startsWith(":")) {
        if (index !== lastWordIndex || !isTypingLastWord) {
          const tagValue = word.slice(1);
          if (tagValue) tags.push(tagValue);
        }
      } else {
        searchTerms.push(word);
      }
    });

    const searchTerm = searchTerms.join(" ").trim();

    if (tags.length === 0 && searchTerm === "" && query.includes(":")) {
      return data?.challenges ?? [];
    }

    return data?.challenges.filter(p => {
      const matchesTitle = searchTerm
        ? p.title.toLowerCase().includes(searchTerm)
        : true

      const matchesTags = tags.length > 0
        ? tags.every(tag => {
          const matchDifficulty = p.difficulty.toLowerCase() === tag;
          const matchPlan = p.plan.toLowerCase() === tag;
          const matchStatus = p.status.toLowerCase() === tag;

          const matchLanguage = p.languages.some(lang =>
            lang.toLowerCase() === tag
          );

          const matchNew = tag === "new" && p.isNew;
          return matchDifficulty || matchPlan || matchStatus || matchLanguage || matchNew;
        })
        : true

      return matchesTitle && matchesTags
    }) ?? []
  }, [query, data])

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const offset = Math.max(0, selectedIndex - visibleItems + 1);
  const visibleChallenges = search.slice(offset, offset + visibleItems);

  useInput((input, key) => {
    if (input) return

    if (key.upArrow) {
      setSelectedIndex((prev) => (prev < search.length - 1 ? prev + 1 : prev));
    }

    if (key.downArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }

    if (key.return) {
      onSelectResult(search[selectedIndex])
    }
  })

  const STATUS_MESSAGES: Partial<Record<Status, string>> = {
    validating_session: "Verifying credentials...",
    get_data: "Obtaining challenges from the API...",
    scraping_data: "Filtering results...",
  };

  return (
    <Box flexDirection="column">
      {STATUS_MESSAGES[status] ? (
        <Box marginBottom={5}>
          <LoaderCard
            message={STATUS_MESSAGES[status]}
            isCentered={false}
          />
        </Box>
      ) : (
        <>
          {
            search.length > 0 ? (
              <Box flexDirection="column-reverse">
                {
                  visibleChallenges.map((c) => {
                    const isActive = search.indexOf(c) === selectedIndex

                    return (
                      <Box flexDirection="column-reverse" key={c.id}>
                        <ChallengeCardSearch
                          isFocused={isActive}
                          {...c}
                        />
                      </Box>
                    )
                  })
                }
              </Box>
            ) : (
              <Box marginBottom={3}>
                <Text bold>No challenges were found matching <Text color={theme.info}>"{query}"</Text></Text>
              </Box>
            )
          }
        </>
      )
      }
    </Box>
  )
}