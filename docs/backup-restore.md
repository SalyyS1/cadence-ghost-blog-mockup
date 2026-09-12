# Backup and restore

## Backup

Create a private backup directory outside the repository. Record the current image versions with `docker compose images`.

Database:

```text
docker compose exec -T database sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction --routines --triggers ghost' > ghost.sql
```

Content volume:

```text
docker run --rm -v bateson-ghost_ghost_content:/source:ro -v /absolute/backup/path:/backup alpine tar -czf /backup/ghost-content.tgz -C /source .
```

Encrypt backups at rest and keep at least one copy on a separate provider. Test a restore regularly.

## Restore

1. Stop Ghost but leave MySQL available: `docker compose stop ghost`.
2. Restore the content archive into the `ghost_content` volume.
3. Import the SQL dump into the configured database.
4. Start Ghost and inspect migration logs: `docker compose up -d ghost`.
5. Verify posts, users, images, members and theme settings before reopening traffic.

## Ghost export

Ghost Admin can also export publication JSON and members CSV. These are useful portable copies but do not replace the MySQL and content-volume backup because uploaded media and operational settings live outside a content JSON export.
