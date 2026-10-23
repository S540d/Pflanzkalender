import React, { useCallback, useState } from 'react';
import { ActivityCompletionModal } from '../components/ActivityCompletionModal';
import { usePlants } from '../contexts/PlantContext';
import type { ActivityInfo } from '../utils/agendaActivities';
import { getCompletion, toIsoDate } from '../utils/completions';

interface Editing {
  plantId: string;
  activityId: string;
  year: number;
  plantName: string;
  activityLabel: string;
}

/**
 * Abhaken und Bearbeiten von Aktivitäts-Erledigungen (Datum/Notiz) – gemeinsam für
 * Agenda und „Jetzt im Garten". `editor` ist das Modal und muss im Screen gerendert werden.
 */
export function useCompletionEditor(fallbackYear: number) {
  const { plants, setActivityCompletion } = usePlants();
  const [editing, setEditing] = useState<Editing | null>(null);

  const toggleDone = useCallback(
    (info: ActivityInfo) => {
      setActivityCompletion(
        info.plantId,
        info.activityId,
        info.year,
        info.completion ? null : { date: toIsoDate(new Date()) }
      );
    },
    [setActivityCompletion]
  );

  const openEditor = useCallback((target: Editing) => {
    setEditing({
      plantId: target.plantId,
      activityId: target.activityId,
      year: target.year,
      plantName: target.plantName,
      activityLabel: target.activityLabel,
    });
  }, []);

  const editingCompletion = editing
    ? getCompletion(
        plants
          .find((p) => p.id === editing.plantId)
          ?.activities.find((a) => a.id === editing.activityId) ?? {},
        editing.year
      )
    : undefined;

  const editor = (
    <ActivityCompletionModal
      visible={editing !== null}
      plantName={editing?.plantName ?? ''}
      activityLabel={editing?.activityLabel ?? ''}
      year={editing?.year ?? fallbackYear}
      completion={editingCompletion}
      onSave={(completion) => {
        if (editing) {
          setActivityCompletion(editing.plantId, editing.activityId, editing.year, completion);
        }
        setEditing(null);
      }}
      onRemove={() => {
        if (editing) {
          setActivityCompletion(editing.plantId, editing.activityId, editing.year, null);
        }
        setEditing(null);
      }}
      onClose={() => setEditing(null)}
    />
  );

  return { toggleDone, openEditor, editor };
}
