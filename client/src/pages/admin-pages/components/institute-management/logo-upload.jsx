import { Image } from "antd";
import { LogoFilePond } from "./logo-filepond";

export function LogoUpload({
  currentLogo,
  onUpload,
  onRemove,
  editable = true,
}) {
  return (
    <div className="space-y-3">
      {currentLogo?.url && <Image src={currentLogo.url} width={200} />}

      {editable && (
        <LogoFilePond
          folderName="institute-logo"
          currentLogo={currentLogo}
          onUpload={(logoPayload) => onUpload(logoPayload)}
          onRemove={() => onRemove()}
        />
      )}
    </div>
  );
}
