import { TeacherMessages } from '../../components/TeacherMessages';
import { getClassRows } from '../../lib/data';

export default function MessagesPage() {
  // Recipients drawn from the (synthetic) class roster.
  const families = getClassRows().map((r) => `${r.name}’s family`);

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Teacher · parent messages
      </div>
      <h1>Message a parent — and know they saw it</h1>
      <p className="lede">
        Send a note home in seconds. It lands as a notification the parent has to acknowledge, and that
        acknowledgement comes straight back here as a read-receipt. No more &ldquo;I never got the message.&rdquo;
      </p>
      <TeacherMessages families={families} />
    </>
  );
}
