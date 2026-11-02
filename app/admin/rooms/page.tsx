'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Gamepad2, Play, RefreshCw, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRooms = () => {
    setIsLoading(true);
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => {
        if (data.rooms) setRooms(data.rooms);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-noir-border">
        <div>
          <h1 className="text-2xl font-bold text-gold-300 font-display">
            مراقبة وإدارة الغرف والمباريات
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            استعراض الغرف النشطة في الوقت الفعلي والتحكم في حالتها.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchRooms} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>تحديث القائمة</span>
        </Button>
      </div>

      {rooms.length === 0 ? (
        <div className="p-12 rounded-2xl bg-noir-card border border-dashed border-noir-border text-center text-xs text-slate-400 space-y-3">
          <Gamepad2 className="w-10 h-10 text-slate-600 mx-auto" />
          <p>لا توجد غرف نشطة حالياً على الخادم.</p>
          <Link href="/room/create">
            <Button size="sm" variant="primary">
              إنشاء غرفة تجريبية جديدة
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {rooms.map((room) => (
            <div
              key={room.code}
              className="p-4 rounded-xl bg-noir-card border border-noir-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <Link href={`/room/${room.code}`}>
                  <Button size="sm" variant="outline" className="gap-1 text-xs">
                    <span>فتح الغرفة</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <span className="text-[10px] text-slate-500 block">المرحلة:</span>
                  <Badge variant="gold" className="text-[10px]">
                    {room.phase}
                  </Badge>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block">اللاعبون:</span>
                  <span className="font-bold text-slate-200">
                    {room.playerCount} / {room.maxPlayers}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block">رمز الغرفة:</span>
                  <span className="font-mono font-extrabold text-gold-400 text-sm">
                    {room.code}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

