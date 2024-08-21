'use client';

import { useEffect, useRef, useState } from 'react';

export const Canvas = () => {
    const [windowSize, setWindowSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
    const currentPositionRef = useRef<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let imgRef = useRef<HTMLImageElement | undefined>(undefined);

    const checkBoundaries: (
        position: { x: number; y: number },
        canvas: HTMLCanvasElement,
    ) => void = (position, canvas) => {
        if (!imgRef.current) return;
        const imgWidth = imgRef.current.width;
        const imgHeight = imgRef.current.height;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        if (position.x > 1000) {
            position.x = 1000;
        } else if (position.x < canvasWidth - imgWidth - 1000) {
            position.x = canvasWidth - imgWidth - 1000;
        }

        if (position.y > 1000) {
            position.y = 1000;
        } else if (position.y < canvasHeight - imgHeight - 1000) {
            position.y = canvasHeight - imgHeight - 1000;
        }

        currentPositionRef.current = position;
    };

    const hadleMapZoom = (e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx && imgRef.current) {
                const scale = e.deltaY < 0 ? 1.05 : 0.95;
                const mouseX = e.clientX - canvas.getBoundingClientRect().left;
                const mouseY = e.clientY - canvas.getBoundingClientRect().top;
                const imgX = mouseX - currentPositionRef.current.x;
                const imgY = mouseY - currentPositionRef.current.y;
                const newWidth = imgRef.current.width * scale;
                const newHeight = imgRef.current.height * scale;

                if (
                    newWidth > canvas.width &&
                    newHeight > canvas.height &&
                    newWidth < 8000 &&
                    newHeight < 8000
                ) {
                    imgRef.current.width = newWidth;
                    imgRef.current.height = newHeight;
                    currentPositionRef.current.x = mouseX - imgX * scale;
                    currentPositionRef.current.y = mouseY - imgY * scale;
                } else {
                    return;
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(
                    imgRef.current,
                    currentPositionRef.current.x,
                    currentPositionRef.current.y,
                    imgRef.current.width,
                    imgRef.current.height,
                );
            }
        }
    };

    const handleMapDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (e.button === 0) {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    const moveImage = (moveEvent: MouseEvent) => {
                        if (!imgRef.current) return;
                        let newPosition = {
                            x: currentPositionRef.current.x + moveEvent.movementX,
                            y: currentPositionRef.current.y + moveEvent.movementY,
                        };
                        checkBoundaries(newPosition, e.target as HTMLCanvasElement);
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(
                            imgRef.current,
                            newPosition.x,
                            newPosition.y,
                            imgRef.current.width,
                            imgRef.current.height,
                        );
                    };
                    const stopMovingImage = () => {
                        window.removeEventListener('mousemove', moveImage);
                        window.removeEventListener('mouseup', stopMovingImage);
                    };
                    window.addEventListener('mousemove', moveImage);
                    window.addEventListener('mouseup', stopMovingImage);
                }
            }
        }
    };

    useEffect(() => {
        imgRef.current = new Image();
        imgRef.current.src = 'q6m3ni3st4s81.jpg';

        const handleResize = () => {
            setWindowSize({ w: window.innerWidth, h: window.innerHeight });
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx && imgRef.current) {
                if (imgRef.current) {
                    ctx.drawImage(
                        imgRef.current,
                        currentPositionRef.current.x,
                        currentPositionRef.current.y,
                        imgRef.current.width,
                        imgRef.current.height,
                    );
                }
            }
        }
    }, [windowSize]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx && imgRef.current) {
                imgRef.current.onload = () => {
                    if (imgRef.current) {
                        imgRef.current.width = imgRef.current.width * 0.8;
                        imgRef.current.height = imgRef.current.height * 0.8;
                        currentPositionRef.current.x = -imgRef.current.width / 4.2;
                        currentPositionRef.current.y = -imgRef.current.height / 3.2;
                        ctx.drawImage(
                            imgRef.current,
                            currentPositionRef.current.x,
                            currentPositionRef.current.y,
                            imgRef.current.width,
                            imgRef.current.height,
                        );
                    }
                };
            }
            const handleWheel = (e: WheelEvent) => {
                e.preventDefault();
                hadleMapZoom(e as unknown as React.WheelEvent<HTMLCanvasElement>);
            };
            const handleRMB = (e: MouseEvent) => {
                e.preventDefault();
            };

            canvas.addEventListener('wheel', handleWheel, { passive: false });
            canvas.addEventListener('contextmenu', handleRMB, { passive: false });

            return () => {
                canvas.removeEventListener('wheel', handleWheel);
                canvas.removeEventListener('contextmenu', handleRMB);
            };
        }
    }, []);

    return (
        <canvas
            onMouseDown={handleMapDrag}
            ref={canvasRef}
            width={windowSize.w}
            height={windowSize.h}
        />
    );
};
