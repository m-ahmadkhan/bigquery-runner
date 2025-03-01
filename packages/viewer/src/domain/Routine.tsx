import { HStack, Table, Tbody, Td, Text, Th, Tr } from "@chakra-ui/react";
import formatISO from "date-fns/formatISO";
import React from "react";
import { Routine as RoutineData } from "types";
import { Breakable } from "../ui/Breakable";
import { CopyButton } from "../ui/CopyButton";

export const Routine = ({ routine }: { routine: RoutineData }) => {
  const { projectId, datasetId, routineId } = routine.metadata.routineReference;
  const id = [projectId, datasetId, routineId].join(".");

  console.log("routine:", routine.metadata);

  return (
    <Table>
      <Tbody>
        <Tr>
          <Th>Routine ID</Th>
          <Td>
            <HStack gap={2}>
              <Breakable>{id}</Breakable>
              <CopyButton text={id} />
            </HStack>
          </Td>
        </Tr>
        <Tr>
          <Th>Created</Th>
          <Td>{formatISO(Number(routine.metadata.creationTime))}</Td>
        </Tr>
        <Tr>
          <Th>Last modified</Th>
          <Td>{formatISO(Number(routine.metadata.lastModifiedTime))}</Td>
        </Tr>
        <Tr>
          <Th>Language</Th>
          <Td>{routine.metadata.language}</Td>
        </Tr>
        <Tr>
          <Th>Definition</Th>
          <Td>
            <Text whiteSpace="pre">{routine.metadata.definitionBody}</Text>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
