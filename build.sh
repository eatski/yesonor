
if [ "$MIGRATION" = "1" ]; then
  prisma migrate deploy
else
  echo "MIGRATION is not set to '1'. Skipping prisma migrate deploy."
fi
npx next build