(() => {
  const startBtn=document.querySelector("#startBtn"),stopBtn=document.querySelector("#stopBtn");
  const preview=document.querySelector("#preview"),empty=document.querySelector("#emptyPreview");
  const status=document.querySelector("#status"),hint=document.querySelector("#hint");
  const download=document.querySelector("#downloadLink"),duration=document.querySelector("#duration");
  let stream=null,recorder=null,chunks=[],startedAt=0,clock=null,recordedUrl=null;
  const setStatus=(s)=>status.textContent=s;
  const fmt=(ms)=>{const n=Math.floor(ms/1000);return String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0")};
  function cleanupStream(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}}
  function resetDownload(){if(recordedUrl)URL.revokeObjectURL(recordedUrl);recordedUrl=null;download.removeAttribute("href");download.classList.add("disabled");download.setAttribute("aria-disabled","true")}
  startBtn.addEventListener("click",async()=>{
    if(!navigator.mediaDevices?.getDisplayMedia||!window.MediaRecorder){hint.textContent="Este navegador não suporta gravação de ecrã. Experimente uma versão recente do Chrome ou Edge.";return}
    try{
      resetDownload();chunks=[];stream=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:30},audio:true});
      const mime=["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"].find(t=>MediaRecorder.isTypeSupported(t));
      recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);
      recorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
      recorder.onerror=()=>{setStatus("ERRO");hint.textContent="O navegador encontrou um erro durante a gravação."};
      recorder.onstop=()=>{
        clearInterval(clock);duration.textContent=fmt(Date.now()-startedAt);
        const blob=new Blob(chunks,{type:recorder.mimeType||"video/webm"});
        if(blob.size){recordedUrl=URL.createObjectURL(blob);download.href=recordedUrl;download.download="lader-screen-recording.webm";download.classList.remove("disabled");download.setAttribute("aria-disabled","false");hint.textContent="Gravação pronta. Use o botão para guardar o ficheiro."}
        cleanupStream();startBtn.disabled=false;stopBtn.disabled=true;setStatus("CONCLUÍDO");
      };
      stream.getVideoTracks()[0].addEventListener("ended",()=>{if(recorder?.state==="recording")recorder.stop()});
      recorder.start(250);startedAt=Date.now();clock=setInterval(()=>duration.textContent=fmt(Date.now()-startedAt),500);
      preview.srcObject=stream;preview.style.display="block";empty.style.display="none";preview.muted=true;await preview.play().catch(()=>{});
      startBtn.disabled=true;stopBtn.disabled=false;setStatus("A GRAVAR");hint.textContent="Gravação em andamento. Não feche esta página.";
    }catch(err){cleanupStream();if(err.name==="NotAllowedError"){hint.textContent="Partilha cancelada. Nenhum ecrã foi gravado."}else{hint.textContent="Não foi possível iniciar: "+err.message}setStatus("PRONTO")}
  });
  stopBtn.addEventListener("click",()=>{if(recorder?.state==="recording"){recorder.stop();preview.srcObject=null;preview.pause();preview.removeAttribute("src");preview.style.display="none";empty.style.display="grid"}});
  window.addEventListener("beforeunload",()=>{cleanupStream();if(recordedUrl)URL.revokeObjectURL(recordedUrl)});
})();