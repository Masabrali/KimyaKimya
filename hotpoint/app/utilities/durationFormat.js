export default function formatDuration(duration) {

    let _duration;
    let units;

    if (duration < 1) {
        _duration = parseInt(Math.ceil(duration * 60));
        units = (duration == 1)? 'minute':'minutes';
    } else {

        _duration = parseInt(Math.ceil(duration));

        if (duration > 24) {

            _duration = parseInt(Math.ceil(duration / 24));

            if (duration > 7) {

                _duration = parseInt(Math.ceil(duration / 7));

                if (duration > 4) {

                    _duration = parseInt(Math.ceil(duration / 4));

                    if (duration > 12) {

                        _duration = parseInt(Math.ceil(duration / 12));

                        units = (duration == 1)? 'year':'years';

                    } else units = (duration == 1)? 'month':'months';

                } else units = (duration == 1)? 'week':'weeks';

            } else units = (duration == 1)? 'day':'days';

        } else units = (duration == 1)? 'hour':'hours';
    }

    return { duration: _duration, units: units };
}
