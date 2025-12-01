import React from "react";
import {InputSuggestion, TextInput, TextInputProps} from "../form";
import {InputSyntaxSegment} from "../form/Input.syntax.hook";
import {Badge} from "../badge/Badge";
import {Text} from "../text/Text";
import {useService, useStore} from "../../utils";
import {DUserReactiveService} from "./DUser.service";
import {MenuItem, MenuLabel} from "../menu/Menu";
import {Flex} from "../flex/Flex";
import {IconArrowDown, IconArrowUp, IconCornerDownLeft} from "@tabler/icons-react";
import {Spacing} from "../spacing/Spacing";

export interface DUserInputProps extends TextInputProps {

}

export const DUserInput: React.FC<DUserInputProps> = (props) => {

    const {...rest} = props

    const userService = useService(DUserReactiveService)
    const userStore = useStore(DUserReactiveService)
    const suggestions: InputSuggestion[] = React.useMemo(() => {
        return userService.values().map(user => ({
            value: user.username || "",
            children: <Flex align={"end"} style={{gap: "0.35rem"}}>
                <Text>{user.username}</Text>
                <Text size={"xs"} hierarchy={"tertiary"}>{user.email}</Text>
            </Flex>,
            insertMode: "insert",
            valueData: user,
            groupBy: "Users"
        }))
    }, [userStore])

    const transformSyntax = (
        _?: string | null,
        appliedParts: (InputSuggestion | any)[] = [],
    ): InputSyntaxSegment[] => {

        let cursor = 0

        return appliedParts.map((part: string | InputSuggestion, index) => {
            if (typeof part === "object") {
                const segment = {
                    type: "block",
                    start: cursor,
                    end: cursor + part.value.length,
                    visualLength: 1,
                    content: <Badge color={"info"} border>
                        <Text style={{color: "inherit"}}>
                            @{part.value}
                        </Text>
                    </Badge>,
                }
                cursor += part.value.length
                return segment
            }
            const textString = part ?? ""
            if (!textString.length) return

            if (index == appliedParts.length - 1) {
                const segment = {
                    type: "text",
                    start: cursor,
                    end: cursor + textString.length,
                    visualLength: textString.length,
                    content: textString,
                }
                cursor += textString.length
                return segment
            }
            cursor += textString.length
            return {}
        }) as InputSyntaxSegment[]
    }

    return <TextInput placeholder={"Enter users"}
                      suggestionsEmptyState={<MenuItem><Text>No user found</Text></MenuItem>}
                      onLastTokenChange={token => {
                          userService.getByUsername(token)
                      }}
                      suggestionsFooter={<MenuLabel>
                          <Flex style={{gap: ".35rem"}}>
                              <Flex align={"center"} style={{gap: "0.35rem"}}>
                                  <Flex>
                                      <Badge border><IconArrowUp size={12}/></Badge>
                                      <Badge border><IconArrowDown size={12}/></Badge>
                                  </Flex>
                                  move
                              </Flex>
                              <Spacing spacing={"xxs"}/>
                              <Flex align={"center"} style={{gap: ".35rem"}}>
                                  <Badge border><IconCornerDownLeft size={12}/></Badge>
                                  insert
                              </Flex>
                          </Flex>
                      </MenuLabel>}
                      filterSuggestionsByLastToken
                      enforceUniqueSuggestions
                      transformSyntax={transformSyntax} {...rest}
                      suggestions={suggestions}/>
}